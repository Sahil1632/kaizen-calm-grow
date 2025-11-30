import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TaskReminderRequest {
  userEmail: string;
  taskTitle: string;
  taskDescription?: string;
  xp: number;
  estimatedTime: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, taskTitle, taskDescription, xp, estimatedTime }: TaskReminderRequest = await req.json();

    console.log(`Sending task reminder to ${userEmail} for task: ${taskTitle}`);

    const emailResponse = await resend.emails.send({
      from: "Kaizen Focus <onboarding@resend.dev>",
      to: [userEmail],
      subject: "⏰ Task Reminder: Don't forget your goal!",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌱 Kaizen Focus</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Growth Journey Awaits</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-top: 0;">⏰ Friendly Reminder</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Hey there! It looks like you haven't completed your task yet. Remember, every small step counts towards your growth!
            </p>
            
            <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px;">${taskTitle}</h3>
              ${taskDescription ? `<p style="color: #4a5568; margin: 0 0 15px 0;">${taskDescription}</p>` : ''}
              
              <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ⭐ ${xp} XP
                </span>
                <span style="background: #48bb78; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ⏱️ ${estimatedTime} minutes
                </span>
              </div>
            </div>
            
            <p style="color: #4a5568; line-height: 1.6;">
              <strong>Why complete this task?</strong><br>
              • Earn ${xp} XP towards your growth<br>
              • Maintain your momentum and build consistency<br>
              • Feel the satisfaction of accomplishment
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'https://your-app.lovable.app'}" 
                 style="background: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Start Your Task Now →
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              💡 <strong>Pro tip:</strong> Breaking tasks into smaller chunks makes them easier to complete. You got this!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #a0aec0; font-size: 12px;">
            <p>You're receiving this because you enabled task notifications in Kaizen Focus.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-task-reminder function:", error);
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
