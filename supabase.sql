create table public.app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.app_data enable row level security;
create policy "cada utilizador só acede aos seus dados" on public.app_data
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
