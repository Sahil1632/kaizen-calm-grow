import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking for due report cards...");

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
    const dayOfMonth = now.getDate();

    // Get users who need reports
    const { data: preferences, error: prefError } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("email_notifications_enabled", true)
      .neq("report_frequency", "none")
      .not("notification_email", "is", null);

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      throw prefError;
    }

    console.log(`Found ${preferences?.length || 0} users with report preferences`);

    let reportsSent = 0;

    for (const pref of preferences || []) {
      const shouldSendWeekly = pref.report_frequency === "weekly" && dayOfWeek === 1; // Monday
      const shouldSendMonthly = pref.report_frequency === "monthly" && dayOfMonth === 1; // 1st of month

      if (!shouldSendWeekly && !shouldSendMonthly) {
        continue;
      }

      // Check if we already sent a report recently
      if (pref.last_report_sent_at) {
        const lastSent = new Date(pref.last_report_sent_at);
        const hoursSinceLastReport = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
        
        if (pref.report_frequency === "weekly" && hoursSinceLastReport < 144) { // 6 days
          console.log(`Skipping weekly report for ${pref.notification_email} - sent recently`);
          continue;
        }
        if (pref.report_frequency === "monthly" && hoursSinceLastReport < 600) { // 25 days
          console.log(`Skipping monthly report for ${pref.notification_email} - sent recently`);
          continue;
        }
      }

      // Calculate period dates
      const periodStart = pref.report_frequency === "weekly"
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Fetch user's tasks for the period
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", pref.user_id)
        .gte("created_at", periodStart.toISOString());

      if (tasksError) {
        console.error(`Error fetching tasks for user ${pref.user_id}:`, tasksError);
        continue;
      }

      const completedTasks = tasks?.filter(t => t.status === "completed") || [];
      const abandonedTasks = tasks?.filter(t => t.status === "pending" && t.due_at && new Date(t.due_at) < now) || [];
      const totalTasks = tasks?.length || 0;
      
      const xpEarned = completedTasks.reduce((acc, t) => acc + (t.xp || 0), 0);
      const xpMissed = abandonedTasks.reduce((acc, t) => acc + (t.xp || 0), 0);
      const focusMinutes = completedTasks.reduce((acc, t) => acc + (t.estimated_time || 0), 0);
      const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

      // Generate insight
      let topInsight = "Start completing tasks to see personalized insights!";
      if (completionRate >= 80) {
        topInsight = "Amazing! You're completing most of your tasks. Keep this momentum going!";
      } else if (completionRate >= 50) {
        topInsight = "Good progress! Try breaking larger tasks into smaller milestones.";
      } else if (completionRate > 0) {
        topInsight = "Consider starting with your highest-energy tasks first.";
      }

      // Send report email
      const emailPayload = {
        userEmail: pref.notification_email,
        reportType: pref.report_frequency,
        completedTasks: completedTasks.length,
        totalTasks,
        xpEarned,
        xpMissed,
        focusMinutes,
        interruptedSessions: 0, // We don't have this data in DB
        completionRate,
        topInsight
      };

      console.log(`Sending ${pref.report_frequency} report to ${pref.notification_email}`);

      const sendResponse = await fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify(emailPayload),
      });

      if (sendResponse.ok) {
        // Update last_report_sent_at
        await supabase
          .from("notification_preferences")
          .update({ last_report_sent_at: now.toISOString() })
          .eq("user_id", pref.user_id);
        
        reportsSent++;
        console.log(`Report sent successfully to ${pref.notification_email}`);
      } else {
        console.error(`Failed to send report to ${pref.notification_email}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${preferences?.length || 0} users, sent ${reportsSent} reports` 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-report-due function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
