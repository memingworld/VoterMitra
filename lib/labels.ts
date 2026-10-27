export const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export const STATUSES = ['PENDING', 'INVESTIGATING', 'CONFIRMED', 'DISMISSED'] as const;
export const ANOMALY_TYPES = [
  'BULK_DELETION',
  'DUPLICATE_EPIC',
  'FUZZY_NAME_CLUSTER',
  'HOUSE_OVERCROWDING',
  'AGE_DISCREPANCY',
  'SEX_RATIO_DISTORTION',
] as const;

export const ANOMALY_LABELS: Record<string, string> = {
  BULK_DELETION: 'Bulk removals',
  DUPLICATE_EPIC: 'Duplicate EPIC',
  FUZZY_NAME_CLUSTER: 'Similar-name cluster',
  HOUSE_OVERCROWDING: 'Address density outlier',
  AGE_DISCREPANCY: 'Age inconsistency',
  SEX_RATIO_DISTORTION: 'Unusual sex-ratio shift',
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Awaiting review',
  INVESTIGATING: 'Field verification',
  CONFIRMED: 'Escalated for inquiry',
  DISMISSED: 'Closed: explained',
};

export const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-50 text-red-700 ring-red-600/20',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  MEDIUM: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  LOW: 'bg-slate-50 text-slate-600 ring-slate-500/20',
};

export const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  INVESTIGATING: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  CONFIRMED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  DISMISSED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export const VERDICT_LABELS: Record<string, string> = {
  VERIFIED: 'Verified',
  DISPUTED: 'Disputed',
  NOT_PROVABLE: 'Not provable',
  INFO: 'Info',
};

export const VERDICT_PILL_STYLES: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  DISPUTED: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  NOT_PROVABLE: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  INFO: 'bg-sky-50 text-sky-700 ring-sky-600/20',
};

export const ROLES = ['Senior Electoral Officer', 'Field Auditor', 'Observer'] as const;
export type Role = (typeof ROLES)[number];
export const isRole = (value: string): value is Role => (ROLES as readonly string[]).includes(value);

export const REVIEW_DECISIONS = [
  'ESCALATED_FIELD_VISIT',
  'FALSE_POSITIVE_BENIGN',
  'CLERICAL_TYPO',
  'VERIFIED_ANOMALY',
] as const;
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

export const DECISION_META: Record<
  ReviewDecision,
  { label: string; help: string; status: (typeof STATUSES)[number]; roles: readonly Role[] }
> = {
  ESCALATED_FIELD_VISIT: {
    label: 'Send for field verification',
    help: 'Dispatch a Booth Level Officer for a door-to-door check.',
    status: 'INVESTIGATING',
    roles: ['Senior Electoral Officer', 'Field Auditor'],
  },
  FALSE_POSITIVE_BENIGN: {
    label: 'Innocent explanation verified',
    help: 'Close the flag and record which explanation was confirmed.',
    status: 'DISMISSED',
    roles: ['Senior Electoral Officer', 'Field Auditor'],
  },
  CLERICAL_TYPO: {
    label: 'Clerical or data-entry error',
    help: 'Close the flag; the entry needs a routine correction.',
    status: 'DISMISSED',
    roles: ['Senior Electoral Officer', 'Field Auditor'],
  },
  VERIFIED_ANOMALY: {
    label: 'Unexplained after review: escalate',
    help: 'Refer to the competent authority for formal inquiry. This is not a finding of wrongdoing.',
    status: 'CONFIRMED',
    roles: ['Senior Electoral Officer'],
  },
};

export const canDecide = (role: Role, decision: ReviewDecision) => DECISION_META[decision].roles.includes(role);

export const formatDateTime = (value: Date | string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(
    new Date(value),
  );
