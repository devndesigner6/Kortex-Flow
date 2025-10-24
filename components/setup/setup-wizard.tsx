"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"

const SCRIPTS = [
  {
    id: "001",
    name: "Create Database Schema",
    description: "Creates profiles, tasks, emails, and calendar_events tables with security policies",
    file: "001_create_schema.sql",
    sql: `-- Create profiles table for user data
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
  execute function public.handle_updated_at();`,
  },
  {
    id: "002",
    name: "Add OAuth Token Columns",
    description: "Adds columns for storing Gmail and Calendar OAuth tokens",
    file: "002_add_oauth_tokens.sql",
    sql: `-- Add OAuth token columns to profiles table for Gmail and Calendar integration
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
add constraint if not exists calendar_events_google_event_id_unique unique (google_event_id);`,
  },
]

export function SetupWizard() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [completedScripts, setCompletedScripts] = useState<Set<string>>(new Set())

  const copyToClipboard = async (scriptId: string, sql: string) => {
    await navigator.clipboard.writeText(sql)
    setCopiedId(scriptId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const markAsCompleted = (scriptId: string) => {
    setCompletedScripts((prev) => new Set([...prev, scriptId]))
  }

  const allCompleted = completedScripts.size === SCRIPTS.length

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
        <p className="font-mono text-sm text-yellow-500">⚠ DATABASE_SETUP_REQUIRED</p>
        <p className="mt-2 font-mono text-xs text-yellow-500/70">
          Run these SQL scripts in your Supabase dashboard to initialize the database tables.
        </p>
      </div>

      <div className="space-y-4">
        {SCRIPTS.map((script, index) => {
          const isCompleted = completedScripts.has(script.id)
          return (
            <div
              key={script.id}
              className={`rounded-lg border p-6 transition-colors ${
                isCompleted ? "border-green-500/40 bg-green-500/10" : "border-green-500/20 bg-green-500/5"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg text-green-500">STEP_{index + 1}</span>
                    {isCompleted && (
                      <div className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-1">
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="font-mono text-xs text-green-500">COMPLETED</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-mono text-base text-green-500">{script.name}</h3>
                  <p className="mt-1 font-mono text-xs text-green-500/70">{script.description}</p>
                  <p className="mt-2 font-mono text-xs text-green-500/50">File: scripts/{script.file}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded border border-green-500/20 bg-black p-4">
                  <pre className="max-h-48 overflow-auto font-mono text-xs text-green-500/70">{script.sql}</pre>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(script.id, script.sql)}
                    variant="outline"
                    size="sm"
                    className="border-green-500/20 bg-green-500/5 font-mono text-xs text-green-500 hover:bg-green-500/10"
                  >
                    {copiedId === script.id ? (
                      <>
                        <Check className="mr-2 h-3 w-3" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3 w-3" />
                        COPY_SQL
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/project/_/sql/new`, "_blank")}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/20 bg-cyan-500/5 font-mono text-xs text-cyan-500 hover:bg-cyan-500/10"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    OPEN_SUPABASE_SQL_EDITOR
                  </Button>

                  {!isCompleted && (
                    <Button
                      onClick={() => markAsCompleted(script.id)}
                      variant="outline"
                      size="sm"
                      className="border-green-500/20 bg-green-500/5 font-mono text-xs text-green-500 hover:bg-green-500/10"
                    >
                      <Check className="mr-2 h-3 w-3" />
                      MARK_AS_COMPLETED
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {allCompleted && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-6">
          <div className="flex items-center gap-3">
            <Check className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-mono text-base text-green-500">SETUP_COMPLETE</p>
              <p className="mt-1 font-mono text-xs text-green-500/70">
                All database scripts have been executed. You can now use KortexFlow!
              </p>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-4 w-full border-green-500/20 bg-green-500/10 font-mono text-sm text-green-500 hover:bg-green-500/20"
          >
            GO_TO_DASHBOARD →
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="font-mono text-sm text-cyan-500">💡 INSTRUCTIONS</p>
        <ol className="mt-2 space-y-2 font-mono text-xs text-cyan-500/70">
          <li>1. Click "COPY_SQL" to copy the script to your clipboard</li>
          <li>2. Click "OPEN_SUPABASE_SQL_EDITOR" to open Supabase in a new tab</li>
          <li>3. Paste the SQL script into the editor</li>
          <li>4. Click "Run" in Supabase to execute the script</li>
          <li>5. Return here and click "MARK_AS_COMPLETED"</li>
          <li>6. Repeat for all scripts in order</li>
        </ol>
      </div>
    </div>
  )
}
