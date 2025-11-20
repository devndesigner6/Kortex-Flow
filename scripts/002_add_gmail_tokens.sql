-- Add Gmail token columns to profiles table
alter table public.profiles
add column if not exists gmail_access_token text,
add column if not exists gmail_refresh_token text;

-- Add unique constraint on gmail_id for emails table
alter table public.emails
add constraint emails_gmail_id_unique unique (gmail_id);
