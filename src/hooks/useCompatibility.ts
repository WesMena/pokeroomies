import { useMemo } from 'react'
import type { Pokemon, CompatibilityResult } from '../types/pokemon'
import { calculateCompatibility } from '../engine/compatibility'

export function useCompatibility(
  selected: Pokemon | null,
  allPokemon: Pokemon[]
): CompatibilityResult[] {
  return useMemo(() => {
    if (!selected) return []
    return allPokemon
      .filter(p => p.name !== selected.name)
      .map(p => calculateCompatibility(selected, p))
      .sort((a, b) => b.score - a.score)
  }, [selected, allPokemon])
}
