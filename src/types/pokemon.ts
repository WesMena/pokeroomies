export type Habitat = 'Bright' | 'Dark' | 'Warm' | 'Cool' | 'Humid' | 'Dry' | null

export interface Pokemon {
  name: string
  habitat: Habitat
  lots_of: string[]
  spriteUrl?: string   // resolved at runtime from PokeAPI
}

export type BreakdownItemType = 'habitat-match' | 'habitat-clash' | 'trait-match' | 'trait-clash'

export interface BreakdownItem {
  type: BreakdownItemType
  label: string
  points: number
}

export interface CompatibilityResult {
  pokemon: Pokemon
  score: number
  breakdown: BreakdownItem[]
}
