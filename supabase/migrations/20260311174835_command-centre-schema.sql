create extension if not exists "pgcrypto" with schema public;

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text,
  icon text,
  status text,
  focus text,
  quick_links jsonb default '[]'::jsonb,
  order_index int default 0,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text,
  owner text,
  summary text,
  city text,
  priority int default 0,
  last_update timestamptz not null default now(),
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  note text not null,
  author text,
  created_at timestamptz not null default now()
);

alter table public.agents enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;

create policy "agents are public" on public.agents
  for select using (true);
create policy "agents insert" on public.agents
  for insert with check (true);
create policy "agents update" on public.agents
  for update using (true);
create policy "agents delete" on public.agents
  for delete using (true);

create policy "projects are public" on public.projects
  for select using (true);
create policy "projects insert" on public.projects
  for insert with check (true);
create policy "projects update" on public.projects
  for update using (true);
create policy "projects delete" on public.projects
  for delete using (true);

create policy "updates read" on public.project_updates
  for select using (true);
create policy "updates insert" on public.project_updates
  for insert with check (true);
create policy "updates delete" on public.project_updates
  for delete using (true);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger agents_updated_at
  before update on public.agents
  for each row execute procedure public.touch_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.touch_updated_at();

insert into public.agents (slug, name, role, icon, status, focus, quick_links, order_index)
values
  (
    'command-centre',
    'Command Centre',
    'Primary orchestrator',
    '🧭',
    'Coordinating daily plan',
    'Prioritizes tasks and dispatches missions to each specialist.',
    '[{"label":"Control docs","url":"https://docs.google.com/"},{"label":"Strategy board","url":"https://miro.com/"}]',
    1
  ),
  (
    'builder',
    'Builder',
    'Apps + Web',
    '🛠️',
    'Drafting Gus dashboard layout',
    'Turns specs from Command Centre into working products.',
    '[{"label":"Latest build","url":"https://github.com/gusstewart82-droid/Gus-dashboward-app"}]',
    2
  ),
  (
    'researcher',
    'Researcher',
    'Insights + Specs',
    '🔍',
    'Comparing CRM automations',
    'Provides briefs, user research, and reference material.',
    '[{"label":"Knowledge base","url":"https://www.notion.so"}]',
    3
  ),
  (
    'ops',
    'Ops',
    'Automation + Monitoring',
    '⚙️',
    'Checking cron + alerting',
    'Keeps infrastructure healthy and alerts when attention is needed.',
    '[{"label":"Status page","url":"https://status.openclaw.ai"}]',
    4
  )
  on conflict (slug) do nothing;

insert into public.projects (slug, name, status, owner, summary, city, priority)
values
  (
    'client-loop',
    'Client Loyalty OS',
    'Discovery',
    'Builder',
    'Map retention journeys + upsell touchpoints for detailing clients.',
    null,
    1
  ),
  (
    'automation',
    'Automation Backbone',
    'Build',
    'Ops',
    'Wire Supabase + cron runners so agents can trigger workflows.',
    null,
    2
  ),
  (
    'playbook',
    'Agent Playbook',
    'Drafting',
    'Researcher',
    'Document what each agent owns, SLAs, and success metrics.',
    null,
    3
  ),
  (
    'yxe-yyc-marketing',
    'YXE + YYC Marketing Engine',
    'Plan delivered',
    'Researcher',
    '12-month email/retention plan (see plans.md).',
    'Saskatoon + Calgary',
    0
  )
  on conflict (slug) do nothing;
