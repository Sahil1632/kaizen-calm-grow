import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  userEmail: string;
  reportType: "weekly" | "monthly";
  completedTasks: number;
  totalTasks: number;
  xpEarned: number;
  xpMissed: number;
  focusMinutes: number;
  interruptedSessions: number;
  completionRate: number;
  topInsight: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userEmail, 
      reportType,
      completedTasks,
      totalTasks,
      xpEarned,
      xpMissed,
      focusMinutes,
      interruptedSessions,
      completionRate,
      topInsight
    }: ReportEmailRequest = await req.json();

    console.log(`Sending ${reportType} report to ${userEmail}`);

    const periodLabel = reportType === "weekly" ? "This Week" : "This Month";
    const emoji = completionRate >= 70 ? "🌸" : completionRate >= 40 ? "🌿" : "🌱";
    const status = completionRate >= 70 ? "Flourishing!" : completionRate >= 40 ? "Growing Strong" : "Just Starting";

    const emailResponse = await resend.emails.send({
      from: "Kaizen Focus <onboarding@resend.dev>",
      to: [userEmail],
      subject: `${emoji} Your ${reportType === "weekly" ? "Weekly" : "Monthly"} Report Card is Ready!`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, hsl(165, 60%, 50%) 0%, hsl(200, 50%, 70%) 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">${status}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${periodLabel}'s Growth Report</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Progress Circle Visual -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; border: 8px solid #e2e8f0; border-top-color: hsl(165, 60%, 50%); position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 28px; font-weight: bold; color: hsl(165, 60%, 45%);">
                  ${completionRate}%
                </div>
              </div>
              <p style="color: #718096; margin-top: 10px; font-size: 14px;">Completion Rate</p>
            </div>
            
            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px;">
              <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: hsl(165, 60%, 45%);">${completedTasks}</div>
                <div style="color: #718096; font-size: 12px; margin-top: 4px;">Tasks Done</div>
              </div>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: hsl(200, 50%, 50%);">${Math.round(focusMinutes / 60)}h</div>
                <div style="color: #718096; font-size: 12px; margin-top: 4px;">Focused Time</div>
              </div>
            </div>
            
            <!-- XP Balance -->
            <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 16px;">⭐ XP Balance</h3>
              <div style="display: flex; justify-content: space-around;">
                <div style="text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: hsl(165, 60%, 45%);">+${xpEarned}</div>
                  <div style="color: #718096; font-size: 12px;">Earned</div>
                </div>
                <div style="width: 1px; background: #e2e8f0;"></div>
                <div style="text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #e53e3e;">-${xpMissed}</div>
                  <div style="color: #718096; font-size: 12px;">Missed</div>
                </div>
              </div>
            </div>
            
            ${interruptedSessions > 0 ? `
            <!-- Interruptions -->
            <div style="background: #fff5f5; border-left: 4px solid hsl(340, 75%, 65%); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0; color: #2d3748;">
                🛑 <strong>${interruptedSessions} session${interruptedSessions > 1 ? 's' : ''}</strong> stopped early
              </p>
              <p style="margin: 8px 0 0 0; color: #718096; font-size: 13px;">
                Try the 2-minute rule: if you feel like stopping, just do 2 more minutes.
              </p>
            </div>
            ` : ''}
            
            <!-- Insight -->
            <div style="background: linear-gradient(135deg, hsl(165, 50%, 95%) 0%, hsl(210, 50%, 95%) 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 10px 0; color: #2d3748; font-size: 16px;">💡 Your Insight</h3>
              <p style="margin: 0; color: #4a5568; line-height: 1.6;">${topInsight}</p>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/report" 
                 style="background: linear-gradient(135deg, hsl(165, 60%, 50%) 0%, hsl(200, 50%, 60%) 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                View Full Report Card →
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 24px; color: #a0aec0; font-size: 12px;">
            <p>You're receiving this ${reportType} report because you enabled it in your notification settings.</p>
            <p style="margin-top: 8px;">Keep growing! 🌱</p>
          </div>
        </div>
      `,
    });

    console.log("Report email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-report-email function:", error);
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
