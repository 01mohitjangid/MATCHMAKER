/**
 * Tiny deterministic PRNG (mulberry32) + helpers.
 *
 * We seed all dummy-data generation so the profile pool is identical on every
 * reload and across server/client renders. This avoids hydration mismatches
 * and keeps the demo stable (the same customer always gets the same matches).
 */

export type Rng = () => number;

/** Returns a seeded random function producing floats in [0, 1). */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] inclusive. */
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Pick one element from a non-empty array. */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Pick `count` distinct elements (or all, if count exceeds length). */
export function pickMany<T>(rng: Rng, items: readonly T[], count: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return out;
}

/** True with the given probability (0–1). */
export function chance(rng: Rng, probability: number): boolean {
  return rng() < probability;
}

/** Weighted pick: items paired with relative weights. */
export function weightedPick<T>(
  rng: Rng,
  entries: readonly (readonly [T, number])[],
): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}
