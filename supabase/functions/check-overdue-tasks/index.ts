import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const cronSecret = Deno.env.get("CRON_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate cron secret
    const requestSecret = req.headers.get("x-cron-secret");
    if (!cronSecret || requestSecret !== cronSecret) {
      console.error("Invalid or missing cron secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Starting overdue tasks check...");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the database function to get overdue tasks
    const { data: overdueTasks, error } = await supabase.rpc("get_overdue_tasks");

    if (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }

    console.log(`Found ${overdueTasks?.length || 0} overdue tasks`);

    const emailResults = [];

    if (overdueTasks && overdueTasks.length > 0) {
      for (const task of overdueTasks) {
        try {
          console.log(`Sending reminder for task: ${task.title} to ${task.user_email}`);
          
          // Call the send-task-reminder function with cron secret
          const { data: emailResult, error: emailError } = await supabase.functions.invoke(
            "send-task-reminder",
            {
              body: {
                userEmail: task.user_email,
                taskTitle: task.title,
                taskDescription: task.description,
                xp: task.xp,
                estimatedTime: task.estimated_time,
              },
              headers: {
                "x-cron-secret": cronSecret!,
              },
            }
          );

          if (emailError) {
            console.error(`Error sending email for task ${task.task_id}:`, emailError);
            emailResults.push({ 
              taskId: task.task_id, 
              success: false, 
              error: emailError.message 
            });
          } else {
            console.log(`Email sent successfully for task ${task.task_id}`);
            emailResults.push({ 
              taskId: task.task_id, 
              success: true 
            });
          }
        } catch (emailError: any) {
          console.error(`Exception sending email for task ${task.task_id}:`, emailError);
          emailResults.push({ 
            taskId: task.task_id, 
            success: false, 
            error: emailError.message 
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        overdueTasksCount: overdueTasks?.length || 0,
        emailResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-overdue-tasks function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
