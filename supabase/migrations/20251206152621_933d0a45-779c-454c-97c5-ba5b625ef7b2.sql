-- Add report frequency preference to notification_preferences
ALTER TABLE public.notification_preferences 
ADD COLUMN IF NOT EXISTS report_frequency text DEFAULT 'weekly' CHECK (report_frequency IN ('weekly', 'monthly', 'none')),
ADD COLUMN IF NOT EXISTS last_report_sent_at timestamp with time zone;