import { describe, it, expect } from 'vitest'
import { calculateCompatibility } from '../../src/engine/compatibility'
import type { Pokemon } from '../../src/types/pokemon'

const make = (overrides: Partial<Pokemon>): Pokemon => ({
  name: 'TestMon',
  habitat: null,
  lots_of: [],
  ...overrides,
})

describe('habitat scoring', () => {
  it('awards +20 for matching habitat', () => {
    const a = make({ habitat: 'Bright' })
    const b = make({ habitat: 'Bright' })
    const result = calculateCompatibility(a, b)
    expect(result.score).toBe(20)
    expect(result.breakdown).toContainEqual(
      expect.objectContaining({ type: 'habitat-match', points: 20 })
    )
  })

  it('awards 0 for different but compatible habitats', () => {
    const a = make({ habitat: 'Bright' })
    const b = make({ habitat: 'Warm' })
    const result = calculateCompatibility(a, b)
    expect(result.score).toBe(0)
    expect(result.breakdown.filter(i => i.type.startsWith('habitat'))).toHaveLength(0)
  })

  it('deducts -20 for incompatible habitats (Bright vs Dark)', () => {
    const a = make({ habitat: 'Bright' })
    const b = make({ habitat: 'Dark' })
    const result = calculateCompatibility(a, b)
    expect(result.score).toBe(-20)
    expect(result.breakdown).toContainEqual(
      expect.objectContaining({ type: 'habitat-clash', points: -20 })
    )
  })

  it('deducts -20 for incompatible habitats (reverse order: Dark vs Bright)', () => {
    const a = make({ habitat: 'Dark' })
    const b = make({ habitat: 'Bright' })
    expect(calculateCompatibility(a, b).score).toBe(-20)
  })

  it('awards 0 when either habitat is null', () => {
    const a = make({ habitat: null })
    const b = make({ habitat: 'Bright' })
    expect(calculateCompatibility(a, b).score).toBe(0)
    expect(calculateCompatibility(b, a).score).toBe(0)
  })
})

describe('trait scoring', () => {
  it('awards +5 per shared trait from the selected Pokémon perspective', () => {
    const selected = make({ lots_of: ['Nature', 'Soft', 'Cute'] })
    const candidate = make({ lots_of: ['Nature', 'Soft'] })
    expect(calculateCompatibility(selected, candidate).score).toBe(10)
  })

  it('only scores traits the selected Pokémon has (one-directional)', () => {
    const selected = make({ lots_of: ['Nature'] })
    const candidate = make({ lots_of: ['Nature', 'Fire', 'Hard'] })
    // Only 'Nature' matches from selected's perspective → +5
    expect(calculateCompatibility(selected, candidate).score).toBe(5)
  })

  it('deducts -5 when selected has trait A and candidate has clashing trait B', () => {
    const selected = make({ lots_of: ['Cleanliness'] })
    const candidate = make({ lots_of: ['Garbage'] })
    expect(calculateCompatibility(selected, candidate).score).toBe(-5)
  })

  it('deducts -5 when clash pair is in reverse order', () => {
    const selected = make({ lots_of: ['Garbage'] })
    const candidate = make({ lots_of: ['Cleanliness'] })
    expect(calculateCompatibility(selected, candidate).score).toBe(-5)
  })

  it('does NOT deduct clash when neither Pokémon has the clashing trait', () => {
    const selected = make({ lots_of: ['Nature'] })
    const candidate = make({ lots_of: ['Water'] })
    expect(calculateCompatibility(selected, candidate).score).toBe(0)
  })
})

describe('combined scoring', () => {
  it('combines habitat and trait scores', () => {
    const selected = make({ habitat: 'Bright', lots_of: ['Nature', 'Soft'] })
    const candidate = make({ habitat: 'Bright', lots_of: ['Nature', 'Hard'] })
    // Habitat match: +20
    // Nature shared: +5
    // Hard↔Soft clash (selected has Soft, candidate has Hard): -5
    expect(calculateCompatibility(selected, candidate).score).toBe(20)
  })
})
