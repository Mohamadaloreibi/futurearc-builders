-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can submit to waitlist" ON public.waitlist_signups;

-- Create a more explicit policy that still allows public submissions
-- but validates that an email is provided (not truly permissive)
CREATE POLICY "Anyone can submit to waitlist with email"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email <> '');

-- Block anonymous access to profiles table for SELECT
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to waitlist_signups for SELECT  
CREATE POLICY "Block anonymous access to waitlist signups"
ON public.waitlist_signups
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to user_roles for SELECT
CREATE POLICY "Block anonymous access to user roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);