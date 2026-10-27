-- Benchmark answer key: one row per planted scenario.
-- The generator fills this from ground_truth_answer_key.json;
-- flags.planted_scenario_id should match scenario_id.
create table if not exists benchmark_scenarios (
  scenario_id  varchar(50) primary key,
  anomaly_type varchar(80) not null,
  ac_no        integer,
  part_no      integer,
  description  text
);

create index if not exists idx_reviews_flag on reviews (flag_id, created_at desc);
create index if not exists idx_claim_audits_created on claim_audits (created_at desc);

-- Ensure claim_audits supports confidence, reasoning, and standard verdicts
alter table claim_audits add column if not exists confidence varchar(20);
alter table claim_audits add column if not exists reasoning jsonb default '[]'::jsonb;
alter table claim_audits drop constraint if exists claim_audits_verdict_check;

-- The decision trail is append-only: reviews can be added, never edited.
-- (Deletes still cascade when the detector re-runs and replaces flags.)
create or replace function reviews_block_update() returns trigger
language plpgsql as $$
begin
  raise exception 'reviews are append-only; record a new review instead';
end;
$$;

drop trigger if exists reviews_append_only on reviews;
create trigger reviews_append_only
  before update on reviews
  for each row execute function reviews_block_update();
