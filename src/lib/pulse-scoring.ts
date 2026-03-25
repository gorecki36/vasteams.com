export interface RawAnswers {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
}

export interface PulseScores {
  substitution: number;
  expansion: number;
  agency: number;
  meaning: number;
  risk: number;
  fragileAugmentation: boolean;
}

/**
 * Compute composite scores from raw 1-7 survey answers.
 *
 * - Substitution: q1 (cognitive offloading)
 * - Expansion: avg(q2, q5) (cognitive expansion + role breadth)
 * - Agency: avg(q4, q7) (confidence + growth)
 * - Meaning: q3 (meaningful work)
 * - Risk: q6 (work addiction / compulsion)
 * - Fragile Augmentation: high substitution + low agency
 */
export function computeScores(raw: RawAnswers): PulseScores {
  const substitution = raw.q1;
  const expansion = (raw.q2 + raw.q5) / 2;
  const agency = (raw.q4 + raw.q7) / 2;
  const meaning = raw.q3;
  const risk = raw.q6;
  const fragileAugmentation = substitution >= 5 && agency < 4;

  return { substitution, expansion, agency, meaning, risk, fragileAugmentation };
}

/** Convert a database row's q-columns into a RawAnswers object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToRaw(row: Record<string, any>): RawAnswers {
  return {
    q1: row.q1_substitution,
    q2: row.q2_expansion,
    q3: row.q3_meaning,
    q4: row.q4_efficacy,
    q5: row.q5_role_breadth,
    q6: row.q6_addiction,
    q7: row.q7_progress,
  };
}

/** Get the Monday of the current ISO week in UTC */
export function getCurrentWeekMonday(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff)
  );
  return monday.toISOString().slice(0, 10);
}
