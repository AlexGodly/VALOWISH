create table if not exists public.valowish_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.valowish_data enable row level security;
create policy "Users can read own valowish data" on public.valowish_data for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own valowish data" on public.valowish_data for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own valowish data" on public.valowish_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own valowish data" on public.valowish_data for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.valowish_data to authenticated;
