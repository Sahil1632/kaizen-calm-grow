import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Mail, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ReportFrequency = "weekly" | "monthly" | "none";

const NotificationSettings = () => {
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nudgeHours, setNudgeHours] = useState(24);
  const [reportFrequency, setReportFrequency] = useState<ReportFrequency>("weekly");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage notification settings",
          variant: "destructive",
        });
        navigate("/home");
        return;
      }

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
        console.error("Error fetching notification settings:", error);
        throw error;
      }

      if (data) {
        setEmail(data.notification_email || "");
        setNotificationsEnabled(data.email_notifications_enabled);
        setNudgeHours(data.nudge_hours_after);
        setReportFrequency((data as any).report_frequency || "weekly");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to save settings",
          variant: "destructive",
        });
        return;
      }

      // Validate email if notifications are enabled
      if (notificationsEnabled && !email) {
        toast({
          title: "Email required",
          description: "Please enter your email to receive notifications",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: session.user.id,
          notification_email: email,
          email_notifications_enabled: notificationsEnabled,
          nudge_hours_after: nudgeHours,
          report_frequency: reportFrequency,
        } as any, {
          onConflict: "user_id"
        });

      if (error) {
        console.error("Error saving settings:", error);
        throw error;
      }

      toast({
        title: "Settings saved!",
        description: "Your notification preferences have been updated",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-zen">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-4">
        <div className="flex items-center mb-6 gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-growth">Notification Settings</h1>
          </div>
        </div>

        <Card className="p-6 shadow-zen bg-card/90 backdrop-blur-sm rounded-3xl">
          <div className="space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                <Label className="text-base font-semibold text-growth">Email Notifications</Label>
                <p className="text-sm text-zen">
                  Receive email reminders for overdue tasks
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-growth">
                <Mail className="w-4 h-4" />
                Notification Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!notificationsEnabled}
                className="rounded-2xl bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                We'll send task reminders to this email address
              </p>
            </div>

            {/* Nudge Hours */}
            <div className="space-y-2">
              <Label htmlFor="nudgeHours" className="flex items-center gap-2 text-growth">
                <Clock className="w-4 h-4" />
                Reminder Delay (hours)
              </Label>
              <Input
                id="nudgeHours"
                type="number"
                min="1"
                max="168"
                value={nudgeHours}
                onChange={(e) => setNudgeHours(parseInt(e.target.value) || 24)}
                disabled={!notificationsEnabled}
                className="rounded-2xl bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Send reminder if task is not completed after {nudgeHours} hours
              </p>
            </div>

            {/* Report Frequency */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-growth">
                <FileText className="w-4 h-4" />
                Report Card Frequency
              </Label>
              <p className="text-xs text-muted-foreground -mt-1">
                Receive a summary of your progress via email
              </p>
              <div className="flex gap-2">
                {(["weekly", "monthly", "none"] as ReportFrequency[]).map((freq) => (
                  <Button
                    key={freq}
                    type="button"
                    variant={reportFrequency === freq ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReportFrequency(freq)}
                    disabled={!notificationsEnabled}
                    className="flex-1 rounded-xl capitalize"
                  >
                    {freq === "none" ? "Off" : freq}
                  </Button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={saveSettings}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-full font-semibold"
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>

            {/* Info Card */}
            <Card className="p-4 bg-primary/5 border-primary/20 rounded-2xl">
              <h3 className="font-semibold text-sm text-growth mb-2">📬 How it works</h3>
              <ul className="text-xs text-zen space-y-1">
                <li>• Tasks created from Smart Guidance will have automatic reminders</li>
                <li>• You'll receive an email if a task isn't completed after the set delay</li>
                <li>• Report cards summarize your completion rate, XP, and insights</li>
                <li>• Weekly reports are sent on Mondays, monthly on the 1st</li>
                <li>• You can disable notifications anytime from this page</li>
              </ul>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
