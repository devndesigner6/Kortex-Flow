-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority text check (priority in ('low', 'medium', 'high', 'urgent')),
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  source text check (source in ('email', 'calendar', 'manual')),
  source_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.tasks enable row level security;

create policy "tasks_select_own"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "tasks_update_own"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create emails table for storing processed emails
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gmail_id text not null,
  subject text,
  sender text,
  body text,
  received_at timestamp with time zone,
  processed boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.emails enable row level security;

create policy "emails_select_own"
  on public.emails for select
  using (auth.uid() = user_id);

create policy "emails_insert_own"
  on public.emails for insert
  with check (auth.uid() = user_id);

create policy "emails_update_own"
  on public.emails for update
  using (auth.uid() = user_id);

-- Create calendar_events table
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_event_id text not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  location text,
  attendees text[],
  needs_confirmation boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.calendar_events enable row level security;

create policy "calendar_events_select_own"
  on public.calendar_events for select
  using (auth.uid() = user_id);

create policy "calendar_events_insert_own"
  on public.calendar_events for insert
  with check (auth.uid() = user_id);

create policy "calendar_events_update_own"
  on public.calendar_events for update
  using (auth.uid() = user_id);

-- Create trigger for profile creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create updated_at trigger for tasks
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();
