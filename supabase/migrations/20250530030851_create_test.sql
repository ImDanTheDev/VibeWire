create table if not exists test_data (
  id bigint primary key generated always as identity,
  name text not null,
  email text,
  created_at timestamptz default now()
);