import type { Pokemon, CompatibilityResult, BreakdownItem } from '../types/pokemon'
import {
  HABITAT_INCOMPATIBLE_PAIRS,
  TRAIT_CLASH_PAIRS,
  SCORE,
} from '../data/compatibilityRules'

function habitatsAreIncompatible(a: string | null, b: string | null): boolean {
  if (!a || !b) return false
  return HABITAT_INCOMPATIBLE_PAIRS.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  )
}

export function calculateCompatibility(
  selected: Pokemon,
  candidate: Pokemon
): CompatibilityResult {
  const breakdown: BreakdownItem[] = []
  let score = 0

  // ── Habitat ──────────────────────────────────────────────────────────
  if (selected.habitat && candidate.habitat) {
    if (selected.habitat === candidate.habitat) {
      score += SCORE.HABITAT_MATCH
      breakdown.push({
        type: 'habitat-match',
        label: `Same habitat: ${selected.habitat}`,
        points: SCORE.HABITAT_MATCH,
      })
    } else if (habitatsAreIncompatible(selected.habitat, candidate.habitat)) {
      score += SCORE.HABITAT_CLASH
      breakdown.push({
        type: 'habitat-clash',
        label: `Incompatible habitats: ${selected.habitat} vs ${candidate.habitat}`,
        points: SCORE.HABITAT_CLASH,
      })
    }
  }

  // ── Trait matches (one-directional from selected's perspective) ───────
  for (const trait of selected.lots_of) {
    if (candidate.lots_of.includes(trait)) {
      score += SCORE.TRAIT_MATCH
      breakdown.push({
        type: 'trait-match',
        label: trait,
        points: SCORE.TRAIT_MATCH,
      })
    }
  }

  // ── Trait clashes ─────────────────────────────────────────────────────
  for (const [traitA, traitB] of TRAIT_CLASH_PAIRS) {
    const selectedHasA = selected.lots_of.includes(traitA)
    const candidateHasB = candidate.lots_of.includes(traitB)
    const selectedHasB = selected.lots_of.includes(traitB)
    const candidateHasA = candidate.lots_of.includes(traitA)

    if ((selectedHasA && candidateHasB) || (selectedHasB && candidateHasA)) {
      score += SCORE.TRAIT_CLASH
      breakdown.push({
        type: 'trait-clash',
        label: `${traitA} ↔ ${traitB}`,
        points: SCORE.TRAIT_CLASH,
      })
    }
  }

  return { pokemon: candidate, score, breakdown }
}
