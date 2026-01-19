-- Step 1: Drop ALL policies that depend on has_role function first
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view waitlist signups" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Admins can delete waitlist signups" ON public.waitlist_signups;

-- Step 2: Now drop the old function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Step 3: Create new secure version that only allows checking current user's role
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Step 4: Recreate all RLS policies with the new single-argument function

-- waitlist_signups policies
CREATE POLICY "Admins can view waitlist signups"
ON public.waitlist_signups
FOR SELECT
TO authenticated
USING (public.has_role('admin'::app_role));

CREATE POLICY "Admins can delete waitlist signups"
ON public.waitlist_signups
FOR DELETE
TO authenticated
USING (public.has_role('admin'::app_role));

-- user_roles policies
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role('admin'::app_role));

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role('admin'::app_role));

-- Step 5: Add input validation constraints for waitlist_signups

-- Email format validation (basic regex)
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT email_format_check 
  CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');

-- Experience values must be one of the allowed values
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT experience_values_check
  CHECK (experience IN ('beginner', 'junior', 'intermediate') OR experience IS NULL);

-- Limit interests field length to prevent excessive data
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT interests_length_check
  CHECK (length(interests) <= 1000 OR interests IS NULL);

-- Email length limit
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT email_length_check
  CHECK (length(email) <= 255);