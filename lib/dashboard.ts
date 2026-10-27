import 'server-only';
import { cache } from 'react';
import { query, withTransaction } from './db';
import { env } from './env';
import { getConstituencySummary, listConstituencies } from './queries';
import { DECISION_META, type ReviewDecision } from './labels';
import type { Reviewer } from './auth';
import type { Confidence, Verdict } from './assistant';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: string) => UUID_RE.test(value);

const SEVERITY_ORDER = `case f.severity when 'CRITICAL' then 0 when 'HIGH' then 1 when 'MEDIUM' then 2 else 3 end`;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/* ---------- flag list ---------- */

export interface FlagListItem {
  id: string;
  anomalyType: string;
  severity: string;
  status: string;
  acNo: number;
  acName: string | null;
  partNo: number;
  affectedCount: number;
  confidence: number;
  z: number | null;
  primaryFinding: string;
}

/** status: a STATUSES value, 'OPEN' (pending + investigating, the default) or 'ALL'. */
export interface FlagFilters {
  severity?: string;
  status?: string;
  type?: string;
}

export async function listFlags(filters: FlagFilters, limit = 200): Promise<FlagListItem[]> {
  const status = filters.status === 'ALL' ? null : (filters.status ?? 'OPEN');
  const { rows } = await query<{
    id: string;
    anomaly_type: string;
    severity: string;
    status: string;
    ac_no: number;
    ac_name: string | null;
    part_no: number;
    affected_count: number;
    confidence_score: string;
    z_score: string | null;
    primary_finding: string;
  }>(
    `select f.id, f.anomaly_type, f.severity, coalesce(f.status, 'PENDING') as status,
            f.ac_no, c.ac_name, f.part_no, f.affected_count, f.confidence_score, f.z_score, f.primary_finding
       from flags f
       left join constituencies c on c.ac_no = f.ac_no
      where ($1::text is null or f.severity = $1)
        and ($2::text is null
             or ($2 = 'OPEN' and coalesce(f.status, 'PENDING') in ('PENDING', 'INVESTIGATING'))
             or coalesce(f.status, 'PENDING') = $2)
        and ($3::text is null or f.anomaly_type = $3)
      order by ${SEVERITY_ORDER}, f.confidence_score desc, f.created_at desc
      limit $4`,
    [filters.severity ?? null, status, filters.type ?? null, limit],
  );

  return rows.map((r) => ({
    id: r.id,
    anomalyType: r.anomaly_type,
    severity: r.severity,
    status: r.status,
    acNo: r.ac_no,
    acName: r.ac_name,
    partNo: r.part_no,
    affectedCount: r.affected_count,
    confidence: Number(r.confidence_score),
    z: r.z_score === null ? null : Number(r.z_score),
    primaryFinding: r.primary_finding,
  }));
}

/* ---------- overview ---------- */

export interface RecentClaim {
  id: string;
  source: string;
  language_code: string | null;
  verdict: string | null;
  confidence: string | null;
  official_explanation: string;
  created_at: Date;
}

export async function getOverview() {
  const acs = await listConstituencies();
  const openFilter = `filter (where coalesce(status, 'PENDING') in ('PENDING', 'INVESTIGATING'))`;

  const [summaries, byType, bySeverity, recent, topFlags] = await Promise.all([
    Promise.all(acs.map((a) => getConstituencySummary({ acNo: a.acNo }))),
    query<{ anomaly_type: string; total: number; open_count: number }>(
      `select anomaly_type, count(*)::int as total, (count(*) ${openFilter})::int as open_count
         from flags group by anomaly_type order by total desc`,
    ),
    query<{ severity: string; total: number; open_count: number }>(
      `select severity, count(*)::int as total, (count(*) ${openFilter})::int as open_count
         from flags group by severity`,
    ),
    query<RecentClaim>(
      `select id, source, language_code, verdict, confidence, official_explanation, created_at
         from claim_audits order by created_at desc limit 6`,
    ),
    listFlags({ status: 'OPEN' }, 5),
  ]);

  const s = summaries.filter((x): x is NonNullable<typeof x> => x !== null);
  const sum = (pick: (x: (typeof s)[number]) => number) => s.reduce((acc, x) => acc + pick(x), 0);
  const openBySeverity = (sev: string) => bySeverity.rows.find((r) => r.severity === sev)?.open_count ?? 0;

  return {
    totals: {
      v1: sum((x) => x.v1Total),
      v2: sum((x) => x.v2Total),
      removedFromRoll: sum((x) => x.removedFromRoll),
      movedWithin: sum((x) => x.movedWithinAc),
      movedWithinAc: sum((x) => x.movedWithinAc),
      newlyAdded: sum((x) => x.newlyAdded),
    },
    flags: {
      total: bySeverity.rows.reduce((acc, r) => acc + r.total, 0),
      open: bySeverity.rows.reduce((acc, r) => acc + r.open_count, 0),
      critical: openBySeverity('CRITICAL'),
      high: openBySeverity('HIGH'),
    },
    byType: byType.rows,
    recentClaims: recent.rows,
    topFlags,
  };
}

/* ---------- benchmark ---------- */

export async function getBenchmark() {
  const [totalsRes, scenarioRes, otherRes] = await Promise.all([
    query<{ total_flags: number; planted_flags: number; scenarios_caught: number; scenarios_defined: number }>(
      `select (select count(*)::int from flags) as total_flags,
              (select count(*)::int from flags where is_planted) as planted_flags,
              (select count(distinct planted_scenario_id)::int from flags
                where is_planted and planted_scenario_id is not null) as scenarios_caught,
              (select count(*)::int from benchmark_scenarios) as scenarios_defined`,
    ),
    query<{ anomaly_type: string; planted: number; caught: number }>(
      `select s.anomaly_type, count(*)::int as planted, count(c.scenario_id)::int as caught
         from benchmark_scenarios s
         left join (select distinct planted_scenario_id as scenario_id from flags where is_planted) c
           on c.scenario_id = s.scenario_id
        group by s.anomaly_type
        order by s.anomaly_type`,
    ),
    query<{ anomaly_type: string; n: number }>(
      `select anomaly_type, count(*)::int as n from flags
        where not coalesce(is_planted, false) group by anomaly_type`,
    ),
  ]);

  const t = totalsRes.rows[0];
  const plantedTotal = t.scenarios_defined || env().BENCHMARK_PLANTED_TOTAL || 0;
  const caught = t.scenarios_defined ? t.scenarios_caught : t.scenarios_caught || t.planted_flags;
  const otherByType = new Map(otherRes.rows.map((r) => [r.anomaly_type, r.n]));

  return {
    totalFlags: t.total_flags,
    caught,
    plantedTotal,
    otherFlags: t.total_flags - t.planted_flags,
    precision: t.total_flags ? t.planted_flags / t.total_flags : null,
    recall: plantedTotal ? Math.min(1, caught / plantedTotal) : null,
    byType: scenarioRes.rows.map((r) => ({ ...r, other: otherByType.get(r.anomaly_type) ?? 0 })),
  };
}

/* ---------- flag detail + reviews ---------- */

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  decision: string;
  innocentReasonAccepted: string | null;
  justification: string;
  createdAt: Date;
}

export async function getFlagDetail(id: string) {
  if (!isUuid(id)) return null;

  const [flagRes, reviewRes] = await Promise.all([
    query<{
      id: string;
      anomaly_type: string;
      severity: string;
      status: string;
      ac_no: number;
      ac_name: string | null;
      part_no: number;
      section_no: number | null;
      affected_count: number;
      confidence_score: string;
      z_score: string | null;
      primary_finding: string;
      evidence_payload: unknown;
      confidence_breakdown: unknown;
      innocent_explanations: unknown;
      created_at: Date;
    }>(
      `select f.id, f.anomaly_type, f.severity, coalesce(f.status, 'PENDING') as status,
              f.ac_no, c.ac_name, f.part_no, f.section_no, f.affected_count,
              f.confidence_score, f.z_score, f.primary_finding,
              f.evidence_payload, f.confidence_breakdown, f.innocent_explanations, f.created_at
         from flags f
         left join constituencies c on c.ac_no = f.ac_no
        where f.id = $1`,
      [id],
    ),
    query<{
      id: string;
      reviewer_name: string;
      reviewer_role: string;
      decision: string;
      innocent_reason_accepted: string | null;
      justification: string;
      created_at: Date;
    }>(
      `select id, reviewer_name, reviewer_role, decision, innocent_reason_accepted, justification, created_at
         from reviews where flag_id = $1 order by created_at desc`,
      [id],
    ),
  ]);

  const r = flagRes.rows[0];
  if (!r) return null;

  return {
    flag: {
      id: r.id,
      anomalyType: r.anomaly_type,
      severity: r.severity,
      status: r.status,
      acNo: r.ac_no,
      acName: r.ac_name,
      partNo: r.part_no,
      sectionNo: r.section_no,
      affectedCount: r.affected_count,
      confidence: Number(r.confidence_score),
      zScore: r.z_score === null ? null : Number(r.z_score),
      primaryFinding: r.primary_finding,
      evidence: r.evidence_payload,
      confidenceBreakdown: isObj(r.confidence_breakdown) ? r.confidence_breakdown : {},
      innocentExplanations: Array.isArray(r.innocent_explanations)
        ? r.innocent_explanations.filter((x): x is string => typeof x === 'string')
        : [],
      createdAt: r.created_at,
    },
    reviews: reviewRes.rows.map(
      (v): ReviewItem => ({
        id: v.id,
        reviewerName: v.reviewer_name,
        reviewerRole: v.reviewer_role,
        decision: v.decision,
        innocentReasonAccepted: v.innocent_reason_accepted,
        justification: v.justification,
        createdAt: v.created_at,
      }),
    ),
  };
}

export async function recordReview(input: {
  flagId: string;
  decision: ReviewDecision;
  justification: string;
  innocentReason: string | null;
  reviewer: Reviewer;
}): Promise<void> {
  await withTransaction(async (client) => {
    const updated = await client.query('update flags set status = $2, updated_at = now() where id = $1', [
      input.flagId,
      DECISION_META[input.decision].status,
    ]);
    if (updated.rowCount === 0) throw new Error('Flag not found');

    await client.query(
      `insert into reviews (flag_id, reviewer_name, reviewer_role, decision, innocent_reason_accepted, justification)
       values ($1, $2, $3, $4, $5, $6)`,
      [input.flagId, input.reviewer.name, input.reviewer.role, input.decision, input.innocentReason, input.justification],
    );
  });
}

/* ---------- public share page ---------- */

/** Wrapped in cache() so generateMetadata and the page share one query per request. */
export const getClaimAudit = cache(async (id: string) => {
  if (!isUuid(id)) return null;
  const { rows } = await query<{
    id: string;
    verdict: Verdict | null;
    confidence: Confidence | null;
    official_explanation: string;
    reasoning: unknown;
    language_code: string | null;
    created_at: Date;
  }>(
    `select id, verdict, confidence, official_explanation, reasoning, language_code, created_at
       from claim_audits where id = $1`,
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    ...r,
    reasoning: Array.isArray(r.reasoning) ? r.reasoning.filter((x): x is string => typeof x === 'string') : [],
  };
});
