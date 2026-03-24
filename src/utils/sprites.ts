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
