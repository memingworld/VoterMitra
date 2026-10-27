import 'server-only';
import { query } from './db';

export function maskName(name: string): string {
  if (!name) return '—';
  return name
    .split(/\s+/)
    .map((part) => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '***' + part[part.length - 1];
    })
    .join(' ');
}

export interface ConstituencyItem {
  acNo: number;
  acName: string;
}

export async function listConstituencies(): Promise<ConstituencyItem[]> {
  const { rows } = await query<{ ac_no: number; ac_name: string }>(
    `select ac_no, ac_name from constituencies order by ac_no`,
  );
  return rows.map((r) => ({ acNo: r.ac_no, acName: r.ac_name }));
}

export interface ConstituencySummary {
  acNo: number;
  v1Total: number;
  v2Total: number;
  removedFromRoll: number;
  movedWithinAc: number;
  newlyAdded: number;
}

export async function getConstituencySummary({ acNo }: { acNo: number }): Promise<ConstituencySummary | null> {
  const { rows } = await query<{
    v1_total: number;
    v2_total: number;
    removed: number;
    moved: number;
    added: number;
  }>(
    `select
       (select count(*)::int from voters_v1 where ac_no = $1) as v1_total,
       (select count(*)::int from voters_v2 where ac_no = $1) as v2_total,
       (select count(*)::int from voters_v1 v1
         where v1.ac_no = $1 and not exists (
           select 1 from voters_v2 v2 where v2.ac_no = $1 and v2.epic_no = v1.epic_no
         )) as removed,
       (select count(*)::int from voters_v1 v1
         join voters_v2 v2 on v1.epic_no = v2.epic_no and v1.ac_no = v2.ac_no
         where v1.ac_no = $1 and v1.part_no != v2.part_no) as moved,
       (select count(*)::int from voters_v2 v2
         where v2.ac_no = $1 and not exists (
           select 1 from voters_v1 v1 where v1.ac_no = $1 and v1.epic_no = v2.epic_no
         )) as added`,
    [acNo],
  );

  const r = rows[0];
  if (!r) return null;

  return {
    acNo,
    v1Total: r.v1_total,
    v2Total: r.v2_total,
    removedFromRoll: r.removed,
    movedWithinAc: r.moved,
    newlyAdded: r.added,
  };
}

export interface PartStats {
  acNo: number;
  partNo: number;
  v1Count: number;
  v2Count: number;
  netChange: number;
  removedCount: number;
  addedCount: number;
  flagsCount: number;
}

export async function getPartStats({ acNo, partNo }: { acNo: number; partNo: number }): Promise<PartStats | null> {
  const { rows } = await query<{
    v1_count: number;
    v2_count: number;
    removed: number;
    added: number;
    flags: number;
  }>(
    `select
       (select count(*)::int from voters_v1 where ac_no = $1 and part_no = $2) as v1_count,
       (select count(*)::int from voters_v2 where ac_no = $1 and part_no = $2) as v2_count,
       (select count(*)::int from voters_v1 v1
         where v1.ac_no = $1 and v1.part_no = $2 and not exists (
           select 1 from voters_v2 v2 where v2.ac_no = $1 and v2.part_no = $2 and v2.epic_no = v1.epic_no
         )) as removed,
       (select count(*)::int from voters_v2 v2
         where v2.ac_no = $1 and v2.part_no = $2 and not exists (
           select 1 from voters_v1 v1 where v1.ac_no = $1 and v1.part_no = $2 and v1.epic_no = v2.epic_no
         )) as added,
       (select count(*)::int from flags where ac_no = $1 and part_no = $2) as flags`,
    [acNo, partNo],
  );

  const r = rows[0];
  if (!r) return null;

  return {
    acNo,
    partNo,
    v1Count: r.v1_count,
    v2Count: r.v2_count,
    netChange: r.v2_count - r.v1_count,
    removedCount: r.removed,
    addedCount: r.added,
    flagsCount: r.flags,
  };
}

export interface PartFlagSummary {
  id: string;
  anomalyType: string;
  severity: string;
  status: string;
  primaryFinding: string;
  affectedCount: number;
  confidenceScore: number;
}

export async function getPartFlags({ acNo, partNo }: { acNo: number; partNo: number }): Promise<PartFlagSummary[]> {
  const { rows } = await query<{
    id: string;
    anomaly_type: string;
    severity: string;
    status: string;
    primary_finding: string;
    affected_count: number;
    confidence_score: string;
  }>(
    `select id, anomaly_type, severity, coalesce(status, 'PENDING') as status,
            primary_finding, affected_count, confidence_score
       from flags
      where ac_no = $1 and part_no = $2
      order by confidence_score desc`,
    [acNo, partNo],
  );

  return rows.map((r) => ({
    id: r.id,
    anomalyType: r.anomaly_type,
    severity: r.severity,
    status: r.status,
    primaryFinding: r.primary_finding,
    affectedCount: r.affected_count,
    confidenceScore: Number(r.confidence_score),
  }));
}

export interface ClaimAuditEntry {
  source: string;
  telegramUserId?: number | null;
  rawQuery: string;
  transcribedText?: string | null;
  languageCode: string;
  selectedFunction: string;
  functionArgs?: unknown;
  toolOutput?: unknown;
  verdict: string | null;
  confidence: string | null;
  reasoning: string[];
  explanation: string;
  executionTimeMs: number;
}

export async function logClaimAudit(e: ClaimAuditEntry): Promise<string | null> {
  const { rows } = await query<{ id: string }>(
    `insert into claim_audits
       (source, telegram_user_id, raw_query, transcribed_text, language_code,
        selected_function, function_args, tool_raw_output,
        verdict, confidence, reasoning, official_explanation, execution_time_ms)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     returning id`,
    [
      e.source,
      e.telegramUserId ?? null,
      e.rawQuery,
      e.transcribedText ?? null,
      e.languageCode,
      e.selectedFunction,
      JSON.stringify(e.functionArgs ?? null),
      JSON.stringify(e.toolOutput ?? null),
      e.verdict,
      e.confidence,
      JSON.stringify(e.reasoning),
      e.explanation,
      e.executionTimeMs,
    ],
  );
  return rows[0]?.id ?? null;
}
