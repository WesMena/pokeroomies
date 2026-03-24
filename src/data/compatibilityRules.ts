import type { Habitat } from '../types/pokemon'

/**
 * Pairs of habitats that are incompatible with each other.
 * Order doesn't matter — the engine checks both directions.
 */
export const HABITAT_INCOMPATIBLE_PAIRS: [Habitat, Habitat][] = [
  ['Bright', 'Dark'],
  ['Humid', 'Dry'],
  ['Warm', 'Cool'],
]

/**
 * Pairs of traits that clash. If one Pokémon has trait A and the
 * other has trait B (in either order), deduct 5 points.
 */
export const TRAIT_CLASH_PAIRS: [string, string][] = [
  ['Cleanliness', 'Garbage'],
  ['Noisy', 'Watching'],
  ['Hard', 'Soft'],
  ['Spooky', 'Healing'],
]

/**
 * Scoring constants — centralised so they never drift.
 */
export const SCORE = {
  HABITAT_MATCH: 20,
  HABITAT_CLASH: -20,
  TRAIT_MATCH: 5,
  TRAIT_CLASH: -5,
} as const
