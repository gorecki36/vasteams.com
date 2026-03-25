import { computeScores, getCurrentWeekMonday, type RawAnswers } from "./pulse-scoring";

function raw(overrides: Partial<RawAnswers> = {}): RawAnswers {
  return { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4, q7: 4, q8: 4, ...overrides };
}

describe("computeScores", () => {
  test("all neutral (4s) — no fragile augmentation", () => {
    const scores = computeScores(raw());
    expect(scores.substitution).toBe(4);
    expect(scores.expansion).toBe(4);
    expect(scores.agency).toBeCloseTo(4);
    expect(scores.meaning).toBe(4);
    expect(scores.risk).toBe(4);
    expect(scores.fragileAugmentation).toBe(false);
  });

  test("all 1s — minimum scores", () => {
    const scores = computeScores(raw({ q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1 }));
    expect(scores.substitution).toBe(1);
    expect(scores.expansion).toBe(1);
    expect(scores.agency).toBeCloseTo(1);
    expect(scores.meaning).toBe(1);
    expect(scores.risk).toBe(1);
    expect(scores.fragileAugmentation).toBe(false);
  });

  test("all 7s — maximum scores", () => {
    const scores = computeScores(raw({ q1: 7, q2: 7, q3: 7, q4: 7, q5: 7, q6: 7, q7: 7, q8: 7 }));
    expect(scores.substitution).toBe(7);
    expect(scores.expansion).toBe(7);
    expect(scores.agency).toBeCloseTo(7);
    expect(scores.meaning).toBe(7);
    expect(scores.risk).toBe(7);
    expect(scores.fragileAugmentation).toBe(false); // agency is 7, not < 4
  });

  test("expansion is average of q2 and q6", () => {
    const scores = computeScores(raw({ q2: 2, q6: 6 }));
    expect(scores.expansion).toBe(4);
  });

  test("agency is average of q4, q5, q8", () => {
    const scores = computeScores(raw({ q4: 3, q5: 6, q8: 3 }));
    expect(scores.agency).toBeCloseTo(4);
  });

  test("fragile augmentation — high substitution, low agency", () => {
    const scores = computeScores(raw({ q1: 6, q4: 2, q5: 3, q8: 2 }));
    expect(scores.substitution).toBe(6);
    expect(scores.agency).toBeCloseTo(2.333, 2);
    expect(scores.fragileAugmentation).toBe(true);
  });

  test("fragile augmentation boundary — substitution exactly 5, agency exactly 4", () => {
    // agency = 4 is NOT < 4, so fragile should be false
    const scores = computeScores(raw({ q1: 5, q4: 4, q5: 4, q8: 4 }));
    expect(scores.fragileAugmentation).toBe(false);
  });

  test("fragile augmentation boundary — substitution 4 (not >= 5)", () => {
    const scores = computeScores(raw({ q1: 4, q4: 1, q5: 1, q8: 1 }));
    expect(scores.fragileAugmentation).toBe(false); // substitution not high enough
  });

  test("fragile augmentation — substitution 5, agency just below 4", () => {
    // agency = (3 + 3 + 3) / 3 = 3 < 4
    const scores = computeScores(raw({ q1: 5, q4: 3, q5: 3, q8: 3 }));
    expect(scores.fragileAugmentation).toBe(true);
  });

  test("meaning and risk are independent single-item scores", () => {
    const scores = computeScores(raw({ q3: 7, q7: 1 }));
    expect(scores.meaning).toBe(7);
    expect(scores.risk).toBe(1);
  });
});

describe("getCurrentWeekMonday", () => {
  test("returns a date string in YYYY-MM-DD format", () => {
    const monday = getCurrentWeekMonday();
    expect(monday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("returns a Monday", () => {
    const monday = getCurrentWeekMonday();
    const date = new Date(monday + "T00:00:00Z");
    expect(date.getUTCDay()).toBe(1); // Monday
  });
});
