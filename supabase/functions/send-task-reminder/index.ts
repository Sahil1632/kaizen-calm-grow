import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const cronSecret = Deno.env.get("CRON_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
  if (!text) return "";
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate cron secret (only internal calls allowed)
    const requestSecret = req.headers.get("x-cron-secret");
    if (!cronSecret || requestSecret !== cronSecret) {
      console.error("Invalid or missing cron secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const { userEmail, taskTitle, taskDescription, xp, estimatedTime } = body;

    // Validate required fields
    if (!userEmail || !isValidEmail(userEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!taskTitle || typeof taskTitle !== "string" || taskTitle.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid task title" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs
    const safeTaskTitle = escapeHtml(taskTitle);
    const safeTaskDescription = taskDescription ? escapeHtml(String(taskDescription).slice(0, 1000)) : null;
    const safeXp = Math.min(Math.max(parseInt(xp) || 0, 0), 1000);
    const safeEstimatedTime = Math.min(Math.max(parseInt(estimatedTime) || 0, 1), 480);

    console.log(`Sending task reminder to ${userEmail} for task: ${safeTaskTitle}`);

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
              <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px;">${safeTaskTitle}</h3>
              ${safeTaskDescription ? `<p style="color: #4a5568; margin: 0 0 15px 0;">${safeTaskDescription}</p>` : ''}
              
              <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ⭐ ${safeXp} XP
                </span>
                <span style="background: #48bb78; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                  ⏱️ ${safeEstimatedTime} minutes
                </span>
              </div>
            </div>
            
            <p style="color: #4a5568; line-height: 1.6;">
              <strong>Why complete this task?</strong><br>
              • Earn ${safeXp} XP towards your growth<br>
              • Maintain your momentum and build consistency<br>
              • Feel the satisfaction of accomplishment
            </p>
            
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
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-task-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
