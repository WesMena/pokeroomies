# Pokéroomies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page React + TypeScript app where users select a Pokémon and see all other Pokémon ranked by roommate compatibility.

**Architecture:** Vite + React + TypeScript + Tailwind CSS. A pure compatibility engine calculates scores from a static JSON dataset. Sprites are resolved at startup via a single PokeAPI batch call. Dynamic styling (card borders, score badge colors, habitat pills) is driven by habitat type and score value using Tailwind's arbitrary value classes.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, Vitest, PokeAPI (sprites only)

**Color Palette:**
- `#FF0000` — primary red (main accent, buttons)
- `#CC0000` — dark red (hover states, borders)
- `#3B4CCA` — blue (habitat: Cool/Humid tags)
- `#FFDE00` — yellow (score badge background, highlights)
- `#B3A125` — dark yellow (score badge text, secondary accents)

---

## File Map

```
/Users/wesmena/Documents/Pokeroomies/
├── public/
│   ├── pokemon.json                      — copy of Pokopia_Housemates.json
│   └── pokeroomiesLogo.png               — copy of logo from Documents
├── src/
│   ├── types/
│   │   └── pokemon.ts                    — Pokemon, CompatibilityResult, BreakdownItem
│   ├── data/
│   │   ├── compatibilityRules.ts         — HABITAT_INCOMPATIBLE, TRAIT_CLASHES constants
│   │   └── nameOverrides.ts              — manual name→PokeAPI-slug fixes (typos in JSON)
│   ├── engine/
│   │   └── compatibility.ts             — calculateCompatibility() pure function
│   ├── utils/
│   │   └── sprites.ts                   — normalizeName(), buildSpriteUrl()
│   ├── hooks/
│   │   ├── usePokemonData.ts            — fetches pokemon.json + resolves all sprite URLs
│   │   └── useCompatibility.ts         — runs engine on selected Pokémon, returns sorted results
│   ├── components/
│   │   ├── Header.tsx                   — logo + title
│   │   ├── PokemonSelector/
│   │   │   ├── PokemonSelector.tsx      — composes SearchBar + PokemonGrid, owns search state
│   │   │   ├── SearchBar.tsx            — controlled input + floating suggestions dropdown
│   │   │   ├── PokemonGrid.tsx          — virtualized-free scrollable grid of all Pokémon
│   │   │   └── PokemonCard.tsx          — sprite + name chip, habitat-colored border, clickable
│   │   └── CompatibilityResults/
│   │       ├── CompatibilityResults.tsx — sorted result list, owns expandedId state
│   │       ├── ResultRow.tsx            — compact row: sprite, name, score badge, expand toggle
│   │       └── BreakdownPills.tsx       — habitat pill + trait match/clash pills
│   ├── App.tsx                          — top-level layout, owns selectedPokemon state
│   ├── main.tsx
│   └── index.css                        — Tailwind directives + custom font import
├── tests/
│   └── engine/
│       └── compatibility.test.ts        — unit tests for the scoring engine
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `/Users/wesmena/Documents/Pokeroomies/` (Vite project)
- Create: `tailwind.config.ts`
- Create: `src/index.css`
- Copy: `public/pokemon.json`, `public/pokeroomiesLogo.png`

- [ ] **Step 1.1: Scaffold Vite project**

```bash
cd /Users/wesmena/Documents/Pokeroomies
npm create vite@latest . -- --template react-ts
# When prompted about existing files: choose to ignore/overwrite non-conflicting
npm install
```

- [ ] **Step 1.2: Install Tailwind CSS and Vitest**

```bash
npm install -D tailwindcss@3 postcss autoprefixer vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
npx tailwindcss init -p --ts
```

- [ ] **Step 1.3: Configure tailwind.config.ts**

Replace the generated file with:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pkred: '#FF0000',
        pkred2: '#CC0000',
        pkblue: '#3B4CCA',
        pkyellow: '#FFDE00',
        pkyellow2: '#B3A125',
      },
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 1.4: Update src/index.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  background-color: #0f0f0f;
  color: #f0f0f0;
  font-family: system-ui, sans-serif;
}
```

- [ ] **Step 1.5: Configure Vitest in vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 1.6: Create tests/setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 1.7: Copy data files**

```bash
cp /Users/wesmena/Documents/Pokopia_Housemates.json /Users/wesmena/Documents/Pokeroomies/public/pokemon.json
cp /Users/wesmena/Documents/pokeroomiesLogo.png /Users/wesmena/Documents/Pokeroomies/public/pokeroomiesLogo.png
```

- [ ] **Step 1.8: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server running, browser shows default React page.

- [ ] **Step 1.9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + TS + Tailwind project"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types/pokemon.ts`

- [ ] **Step 2.1: Create type definitions**

```ts
// src/types/pokemon.ts

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
```

- [ ] **Step 2.2: Commit**

```bash
git add src/types/pokemon.ts
git commit -m "feat: add core TypeScript types"
```

---

## Task 3: Compatibility Rules Data

**Files:**
- Create: `src/data/compatibilityRules.ts`
- Create: `src/data/nameOverrides.ts`

- [ ] **Step 3.1: Create compatibility rules**

```ts
// src/data/compatibilityRules.ts
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
```

- [ ] **Step 3.2: Create name override map for JSON typos**

```ts
// src/data/nameOverrides.ts

/**
 * Maps the name as it appears in pokemon.json → correct PokeAPI slug.
 * Only entries that differ need to be listed here.
 */
export const NAME_OVERRIDES: Record<string, string> = {
  'Venasaur': 'venusaur',
  'Ho-Oh': 'ho-oh',           // hyphen is fine in PokeAPI
  'Mr. Mime': 'mr-mime',
  'Farfetch\'d': 'farfetchd',
  'Nidoran♀': 'nidoran-f',
  'Nidoran♂': 'nidoran-m',
}
```

- [ ] **Step 3.3: Commit**

```bash
git add src/data/
git commit -m "feat: add compatibility rules and name override data"
```

---

## Task 4: Compatibility Engine + Tests

**Files:**
- Create: `src/engine/compatibility.ts`
- Create: `tests/engine/compatibility.test.ts`

- [ ] **Step 4.1: Write failing tests first**

```ts
// tests/engine/compatibility.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCompatibility } from '../../src/engine/compatibility'
import type { Pokemon } from '../../src/types/pokemon'

const make = (overrides: Partial<Pokemon>): Pokemon => ({
  name: 'TestMon',
  habitat: 'Bright',
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
```

- [ ] **Step 4.2: Run tests to confirm they fail**

```bash
npx vitest run tests/engine/compatibility.test.ts
```
Expected: All tests FAIL with "Cannot find module" or similar.

- [ ] **Step 4.3: Implement the compatibility engine**

```ts
// src/engine/compatibility.ts
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
```

- [ ] **Step 4.4: Run tests to verify they pass**

```bash
npx vitest run tests/engine/compatibility.test.ts
```
Expected: All 10 tests PASS.

- [ ] **Step 4.5: Commit**

```bash
git add src/engine/ tests/
git commit -m "feat: implement compatibility engine with full test coverage"
```

---

## Task 5: Sprite Utility

**Files:**
- Create: `src/utils/sprites.ts`

The app resolves sprites by calling a single PokeAPI list endpoint at startup to get a name→ID mapping, then constructs GitHub raw sprite URLs. This avoids 303 individual API calls.

- [ ] **Step 5.1: Create sprite utility**

```ts
// src/utils/sprites.ts
import { NAME_OVERRIDES } from '../data/nameOverrides'

/**
 * Converts a Pokémon name from the JSON into a PokeAPI-compatible slug.
 * e.g. "Mr. Mime" → "mr-mime", "Nidoran♀" → "nidoran-f"
 */
export function normalizeName(name: string): string {
  if (NAME_OVERRIDES[name]) return NAME_OVERRIDES[name]
  return name
    .toLowerCase()
    .replace(/[♀]/g, '-f')
    .replace(/[♂]/g, '-m')
    .replace(/['.]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Fetches a name→spriteUrl map from PokeAPI in a single batch request.
 * Call this once on app startup.
 */
export async function fetchSpriteMap(
  pokemonNames: string[]
): Promise<Record<string, string>> {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=500&offset=0'
  )
  if (!response.ok) throw new Error('Failed to fetch Pokémon list from PokeAPI')

  const data = await response.json() as {
    results: { name: string; url: string }[]
  }

  // Build a slug→id map from the API response
  const slugToId: Record<string, number> = {}
  for (const entry of data.results) {
    // API URL format: https://pokeapi.co/api/v2/pokemon/1/
    const id = parseInt(entry.url.split('/').filter(Boolean).pop() ?? '0', 10)
    slugToId[entry.name] = id
  }

  // Map each Pokémon name from our JSON to its sprite URL
  const spriteMap: Record<string, string> = {}
  for (const name of pokemonNames) {
    const slug = normalizeName(name)
    const id = slugToId[slug]
    if (id) {
      spriteMap[name] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    } else {
      spriteMap[name] = '' // fallback: no sprite
    }
  }

  return spriteMap
}
```

- [ ] **Step 5.2: Commit**

```bash
git add src/utils/ src/data/nameOverrides.ts
git commit -m "feat: add sprite resolution utility with PokeAPI batch fetch"
```

---

## Task 6: Data Hooks

**Files:**
- Create: `src/hooks/usePokemonData.ts`
- Create: `src/hooks/useCompatibility.ts`

- [ ] **Step 6.1: Create usePokemonData hook**

```ts
// src/hooks/usePokemonData.ts
import { useState, useEffect } from 'react'
import type { Pokemon } from '../types/pokemon'
import { fetchSpriteMap } from '../utils/sprites'

interface UsePokemonDataResult {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
}

export function usePokemonData(): UsePokemonDataResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const dataRes = await fetch('/pokemon.json')
        if (!dataRes.ok) throw new Error('Failed to load pokemon.json')
        const raw: Pokemon[] = await dataRes.json()

        // Resolve sprites in parallel with data load
        const spriteMap = await fetchSpriteMap(raw.map(p => p.name))

        setPokemon(
          raw.map(p => ({ ...p, spriteUrl: spriteMap[p.name] ?? '' }))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { pokemon, loading, error }
}
```

- [ ] **Step 6.2: Create useCompatibility hook**

```ts
// src/hooks/useCompatibility.ts
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
```

- [ ] **Step 6.3: Commit**

```bash
git add src/hooks/
git commit -m "feat: add usePokemonData and useCompatibility hooks"
```

---

## Task 7: PokemonCard Component

The card is the building block for the selector grid. Its border color is driven dynamically by the Pokémon's habitat.

**Files:**
- Create: `src/components/PokemonSelector/PokemonCard.tsx`

- [ ] **Step 7.1: Create habitat color utility**

Add to `src/utils/sprites.ts` (append to the file):

```ts
// Append to src/utils/sprites.ts

export const HABITAT_COLORS: Record<string, string> = {
  Bright: '#FFDE00',
  Dark:   '#3B4CCA',
  Warm:   '#FF0000',
  Cool:   '#7ecfed',
  Humid:  '#56c785',
  Dry:    '#c4945a',
}

export function getHabitatColor(habitat: string | null): string {
  return habitat ? (HABITAT_COLORS[habitat] ?? '#888888') : '#555555'
}
```

- [ ] **Step 7.2: Create PokemonCard**

```tsx
// src/components/PokemonSelector/PokemonCard.tsx
import type { Pokemon } from '../../types/pokemon'
import { getHabitatColor } from '../../utils/sprites'

interface PokemonCardProps {
  pokemon: Pokemon
  selected: boolean
  onClick: (pokemon: Pokemon) => void
}

export function PokemonCard({ pokemon, selected, onClick }: PokemonCardProps) {
  const habitatColor = getHabitatColor(pokemon.habitat)

  return (
    <button
      onClick={() => onClick(pokemon)}
      className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-150 hover:scale-105 focus:outline-none w-[80px]"
      style={{
        border: `2px solid ${selected ? '#FF0000' : habitatColor}`,
        backgroundColor: selected ? '#1a0000' : '#1a1a1a',
        boxShadow: selected ? `0 0 10px #FF0000` : `0 0 4px ${habitatColor}44`,
      }}
      title={`${pokemon.name} — ${pokemon.habitat ?? 'No habitat'}`}
    >
      {pokemon.spriteUrl ? (
        <img
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          className="w-12 h-12 object-contain pixelated"
          style={{ imageRendering: 'pixelated' }}
          loading="lazy"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xs"
          style={{ backgroundColor: habitatColor + '33', color: habitatColor }}
        >
          ?
        </div>
      )}
      <span className="text-[8px] text-center leading-tight text-gray-300 w-full truncate">
        {pokemon.name}
      </span>
    </button>
  )
}
```

- [ ] **Step 7.3: Commit**

```bash
git add src/components/ src/utils/sprites.ts
git commit -m "feat: add PokemonCard with dynamic habitat-colored border"
```

---

## Task 8: SearchBar with Suggestions

**Files:**
- Create: `src/components/PokemonSelector/SearchBar.tsx`

- [ ] **Step 8.1: Create SearchBar**

```tsx
// src/components/PokemonSelector/SearchBar.tsx
import { useState, useRef, useEffect } from 'react'
import type { Pokemon } from '../../types/pokemon'

interface SearchBarProps {
  allPokemon: Pokemon[]
  onSelect: (pokemon: Pokemon) => void
  onSearchChange: (query: string) => void
}

export function SearchBar({ allPokemon, onSelect, onSearchChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestions = query.trim().length > 0
    ? allPokemon
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : []

  function handleChange(value: string) {
    setQuery(value)
    onSearchChange(value)
    setShowSuggestions(true)
  }

  function handleSelect(pokemon: Pokemon) {
    setQuery(pokemon.name)
    setShowSuggestions(false)
    onSearchChange('')  // clear grid filter after selection
    onSelect(pokemon)
  }

  function handleClear() {
    setQuery('')
    onSearchChange('')
    setShowSuggestions(false)
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-[#1a1a1a] border-2 border-[#3B4CCA] rounded-lg px-3 py-2 focus-within:border-[#FF0000] transition-colors">
        <span className="text-[#FFDE00]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search Pokémon..."
          className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500"
        />
        {query && (
          <button onClick={handleClear} className="text-gray-400 hover:text-white text-xs">
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#3B4CCA] rounded-lg overflow-hidden shadow-xl">
          {suggestions.map(pokemon => (
            <li key={pokemon.name}>
              <button
                onMouseDown={() => handleSelect(pokemon)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a1a1a] hover:border-l-2 hover:border-[#FF0000] transition-colors text-left"
              >
                {pokemon.spriteUrl && (
                  <img
                    src={pokemon.spriteUrl}
                    alt=""
                    className="w-8 h-8 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
                <span className="text-sm text-white">{pokemon.name}</span>
                {pokemon.habitat && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#3B4CCA22', color: '#3B4CCA', border: '1px solid #3B4CCA55' }}>
                    {pokemon.habitat}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 8.2: Commit**

```bash
git add src/components/PokemonSelector/SearchBar.tsx
git commit -m "feat: add SearchBar with live suggestions dropdown"
```

---

## Task 9: PokemonGrid

**Files:**
- Create: `src/components/PokemonSelector/PokemonGrid.tsx`

- [ ] **Step 9.1: Create PokemonGrid**

```tsx
// src/components/PokemonSelector/PokemonGrid.tsx
import type { Pokemon } from '../../types/pokemon'
import { PokemonCard } from './PokemonCard'

interface PokemonGridProps {
  pokemon: Pokemon[]
  selectedName: string | null
  onSelect: (pokemon: Pokemon) => void
}

export function PokemonGrid({ pokemon, selectedName, onSelect }: PokemonGridProps) {
  if (pokemon.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">No Pokémon found.</p>
    )
  }

  return (
    <div
      className="overflow-y-auto max-h-[340px] pr-1"
      style={{ scrollbarColor: '#FF0000 #1a1a1a', scrollbarWidth: 'thin' }}
    >
      <div className="flex flex-wrap gap-2 justify-start">
        {pokemon.map(p => (
          <PokemonCard
            key={p.name}
            pokemon={p}
            selected={p.name === selectedName}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 9.2: Commit**

```bash
git add src/components/PokemonSelector/PokemonGrid.tsx
git commit -m "feat: add scrollable PokemonGrid"
```

---

## Task 10: PokemonSelector (Composed)

**Files:**
- Create: `src/components/PokemonSelector/PokemonSelector.tsx`

- [ ] **Step 10.1: Create PokemonSelector**

```tsx
// src/components/PokemonSelector/PokemonSelector.tsx
import { useState } from 'react'
import type { Pokemon } from '../../types/pokemon'
import { SearchBar } from './SearchBar'
import { PokemonGrid } from './PokemonGrid'

interface PokemonSelectorProps {
  allPokemon: Pokemon[]
  selectedPokemon: Pokemon | null
  onSelect: (pokemon: Pokemon) => void
}

export function PokemonSelector({
  allPokemon,
  selectedPokemon,
  onSelect,
}: PokemonSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPokemon = searchQuery.trim()
    ? allPokemon.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPokemon

  return (
    <section className="w-full max-w-4xl mx-auto px-4">
      <h2 className="text-[#FFDE00] text-sm font-bold mb-4 uppercase tracking-widest">
        Choose your Pokémon
      </h2>

      <div className="mb-4">
        <SearchBar
          allPokemon={allPokemon}
          onSelect={onSelect}
          onSearchChange={setSearchQuery}
        />
      </div>

      <PokemonGrid
        pokemon={filteredPokemon}
        selectedName={selectedPokemon?.name ?? null}
        onSelect={onSelect}
      />

      {selectedPokemon && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-gray-400">Selected:</span>
          <span className="text-[#FF0000] font-bold">{selectedPokemon.name}</span>
          {selectedPokemon.habitat && (
            <span className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: '#FFDE0022', color: '#FFDE00', border: '1px solid #FFDE0055' }}>
              {selectedPokemon.habitat}
            </span>
          )}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 10.2: Commit**

```bash
git add src/components/PokemonSelector/PokemonSelector.tsx
git commit -m "feat: compose PokemonSelector from SearchBar + PokemonGrid"
```

---

## Task 11: BreakdownPills

**Files:**
- Create: `src/components/CompatibilityResults/BreakdownPills.tsx`

- [ ] **Step 11.1: Create BreakdownPills**

```tsx
// src/components/CompatibilityResults/BreakdownPills.tsx
import type { BreakdownItem } from '../../types/pokemon'

interface BreakdownPillsProps {
  breakdown: BreakdownItem[]
}

const PILL_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'habitat-match': { bg: '#FFDE0015', text: '#FFDE00', border: '#FFDE0055' },
  'habitat-clash': { bg: '#FF000015', text: '#FF6666', border: '#FF000055' },
  'trait-match':   { bg: '#3B4CCA15', text: '#8899ff', border: '#3B4CCA55' },
  'trait-clash':   { bg: '#CC000015', text: '#ff8888', border: '#CC000055' },
}

export function BreakdownPills({ breakdown }: BreakdownPillsProps) {
  if (breakdown.length === 0) {
    return <p className="text-gray-600 text-xs italic">No compatibility factors.</p>
  }

  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {breakdown.map((item, i) => {
        const style = PILL_STYLES[item.type] ?? PILL_STYLES['trait-match']
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          >
            <span>{item.points > 0 ? '+' : ''}{item.points}</span>
            <span>{item.label}</span>
          </span>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 11.2: Commit**

```bash
git add src/components/CompatibilityResults/BreakdownPills.tsx
git commit -m "feat: add BreakdownPills with color-coded match/clash indicators"
```

---

## Task 12: ResultRow

**Files:**
- Create: `src/components/CompatibilityResults/ResultRow.tsx`

The score badge uses the Pokémon-palette yellow for positive scores and red for negative.

- [ ] **Step 12.1: Create ResultRow**

```tsx
// src/components/CompatibilityResults/ResultRow.tsx
import type { CompatibilityResult } from '../../types/pokemon'
import { BreakdownPills } from './BreakdownPills'
import { getHabitatColor } from '../../utils/sprites'

interface ResultRowProps {
  result: CompatibilityResult
  rank: number
  expanded: boolean
  onToggle: () => void
}

function ScoreBadge({ score }: { score: number }) {
  const isPositive = score > 0
  const isNegative = score < 0

  const bg = isPositive ? '#FFDE00' : isNegative ? '#CC0000' : '#333'
  const text = isPositive ? '#B3A125' : isNegative ? '#ffaaaa' : '#aaa'
  const border = isPositive ? '#B3A125' : isNegative ? '#FF0000' : '#555'

  return (
    <div
      className="flex-shrink-0 w-16 h-10 flex items-center justify-center rounded-md font-bold text-sm"
      style={{ backgroundColor: bg, color: text, border: `2px solid ${border}` }}
    >
      {score > 0 ? '+' : ''}{score}
    </div>
  )
}

export function ResultRow({ result, rank, expanded, onToggle }: ResultRowProps) {
  const { pokemon, score, breakdown } = result
  const habitatColor = getHabitatColor(pokemon.habitat)
  const isDimmed = score < 0

  return (
    <div
      className={`rounded-lg overflow-hidden transition-opacity duration-200 ${isDimmed ? 'opacity-50 hover:opacity-80' : ''}`}
      style={{ border: `1px solid ${habitatColor}44`, backgroundColor: '#141414' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        {/* Rank */}
        <span className="text-gray-600 text-xs w-5 text-center flex-shrink-0">
          #{rank}
        </span>

        {/* Sprite */}
        {pokemon.spriteUrl ? (
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className="w-10 h-10 object-contain flex-shrink-0"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex-shrink-0"
            style={{ backgroundColor: habitatColor + '22' }} />
        )}

        {/* Name + Habitat */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{pokemon.name}</p>
          {pokemon.habitat && (
            <span className="text-xs" style={{ color: habitatColor }}>
              {pokemon.habitat}
            </span>
          )}
        </div>

        {/* Score Badge */}
        <ScoreBadge score={score} />

        {/* Expand toggle */}
        <span className="text-gray-500 text-xs ml-1 flex-shrink-0">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: habitatColor + '33' }}>
          <BreakdownPills breakdown={breakdown} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 12.2: Commit**

```bash
git add src/components/CompatibilityResults/ResultRow.tsx
git commit -m "feat: add ResultRow with score badge and expandable breakdown"
```

---

## Task 13: CompatibilityResults

**Files:**
- Create: `src/components/CompatibilityResults/CompatibilityResults.tsx`

- [ ] **Step 13.1: Create CompatibilityResults**

```tsx
// src/components/CompatibilityResults/CompatibilityResults.tsx
import { useState } from 'react'
import type { CompatibilityResult } from '../../types/pokemon'
import { ResultRow } from './ResultRow'

interface CompatibilityResultsProps {
  results: CompatibilityResult[]
  selectedName: string
}

export function CompatibilityResults({
  results,
  selectedName,
}: CompatibilityResultsProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)

  function toggleExpand(name: string) {
    setExpandedName(prev => (prev === name ? null : name))
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-10">
      <h2 className="text-[#FFDE00] text-sm font-bold mb-1 uppercase tracking-widest">
        Best roommates for {selectedName}
      </h2>
      <p className="text-gray-500 text-xs mb-4">
        {results.length} Pokémon ranked by compatibility
      </p>

      <div className="flex flex-col gap-2">
        {results.map((result, i) => (
          <ResultRow
            key={result.pokemon.name}
            result={result}
            rank={i + 1}
            expanded={expandedName === result.pokemon.name}
            onToggle={() => toggleExpand(result.pokemon.name)}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 13.2: Commit**

```bash
git add src/components/CompatibilityResults/CompatibilityResults.tsx
git commit -m "feat: add CompatibilityResults list with single-expand accordion"
```

---

## Task 14: Header

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 14.1: Create Header**

```tsx
// src/components/Header.tsx

export function Header() {
  return (
    <header className="w-full bg-[#0a0a0a] border-b-2 border-[#CC0000] px-6 py-4 flex items-center gap-4 mb-8">
      <img
        src="/pokeroomiesLogo.png"
        alt="Pokéroomies"
        className="h-12 w-auto object-contain"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div>
        <h1 className="text-[#FFDE00] font-pokemon text-lg leading-none tracking-tight">
          Pokéroomies
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Find your perfect Pokémon roommate
        </p>
      </div>
    </header>
  )
}
```

- [ ] **Step 14.2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header with logo and title"
```

---

## Task 15: App Integration + Final Polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 15.1: Wire up App.tsx**

Replace the generated `src/App.tsx` entirely:

```tsx
// src/App.tsx
import { useState } from 'react'
import type { Pokemon } from './types/pokemon'
import { usePokemonData } from './hooks/usePokemonData'
import { useCompatibility } from './hooks/useCompatibility'
import { Header } from './components/Header'
import { PokemonSelector } from './components/PokemonSelector/PokemonSelector'
import { CompatibilityResults } from './components/CompatibilityResults/CompatibilityResults'

export default function App() {
  const { pokemon, loading, error } = usePokemonData()
  const [selected, setSelected] = useState<Pokemon | null>(null)
  const results = useCompatibility(selected, pokemon)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <img src="/pokeroomiesLogo.png" alt="" className="h-16 animate-pulse" />
        <p className="text-[#FFDE00] text-sm">Loading Pokémon data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#FF0000]">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-16">
        <PokemonSelector
          allPokemon={pokemon}
          selectedPokemon={selected}
          onSelect={setSelected}
        />

        {selected && results.length > 0 && (
          <CompatibilityResults
            results={results}
            selectedName={selected.name}
          />
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 15.2: Clean up main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 15.3: Remove Vite boilerplate**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 15.4: Run dev server and do a manual smoke test**

```bash
npm run dev
```

Verify:
- [ ] Page loads with header logo and "Pokéroomies" title
- [ ] Grid shows all 303 Pokémon with sprites (may take a moment to load)
- [ ] Typing in search bar shows up to 5 suggestions with sprites + habitat tag
- [ ] Clicking a suggestion selects that Pokémon
- [ ] Clicking any card in the grid selects that Pokémon
- [ ] Results section appears below the grid when a Pokémon is selected
- [ ] Results are ranked, score badge is yellow (positive) / red (negative)
- [ ] Clicking a result row expands to show breakdown pills
- [ ] Only one row is expanded at a time

- [ ] **Step 15.5: Run the test suite**

```bash
npx vitest run
```
Expected: All tests pass.

- [ ] **Step 15.6: Final commit**

```bash
git add -A
git commit -m "feat: wire up App with full Pokéroomies integration"
```

---

## Known Edge Cases

| Case | Handling |
|---|---|
| `Gyarados`, `Gastrodon E` (null habitat) | 0 points for habitat, no penalty |
| Sprite fetch fails for a Pokémon | Falls back to colored placeholder circle |
| PokeAPI list endpoint is down | `usePokemonData` sets error state, full-page error message |
| Pokémon name typo in JSON (e.g. `Venasaur`) | `NAME_OVERRIDES` map in `nameOverrides.ts` handles it |
| Selecting the same Pokémon again | Deselects (set to null) if already selected — _or_ simply recalculates (current plan keeps it selected) |

---

## Done Criteria

- [ ] All 303 Pokémon visible in the grid with sprites
- [ ] Search filters the grid live; suggestions click-to-select
- [ ] Selecting a Pokémon renders a ranked results list
- [ ] Score badges reflect positive/negative correctly with yellow/red palette
- [ ] Expanding a result row shows habitat pill + trait match/clash pills
- [ ] Unit tests all pass (`npx vitest run`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
