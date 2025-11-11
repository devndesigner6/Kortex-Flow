-- Add OAuth token columns to profiles table for Gmail and Calendar integration
alter table public.profiles
add column if not exists gmail_access_token text,
add column if not exists gmail_refresh_token text,
add column if not exists calendar_access_token text,
add column if not exists calendar_refresh_token text;

-- Add unique constraint on gmail_id to prevent duplicate emails
alter table public.emails
add constraint if not exists emails_gmail_id_unique unique (gmail_id);

-- Add unique constraint on google_event_id to prevent duplicate events
alter table public.calendar_events
add constraint if not exists calendar_events_google_event_id_unique unique (google_event_id);
