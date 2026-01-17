-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  experience TEXT,
  interests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can submit to waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Only allow reading own signup (by email match - for future use)
CREATE POLICY "Users cannot read waitlist"
ON public.waitlist_signups
FOR SELECT
USING (false);