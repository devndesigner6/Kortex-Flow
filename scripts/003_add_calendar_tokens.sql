-- Add Calendar token columns to profiles table
alter table public.profiles
add column if not exists calendar_access_token text,
add column if not exists calendar_refresh_token text;

-- Add unique constraint on google_event_id for calendar_events table
alter table public.calendar_events
add constraint calendar_events_google_event_id_unique unique (google_event_id);
