import { useState, useEffect } from 'react'
import type { Pokemon } from '../types/pokemon'
import { fetchSpriteMap } from '../utils/sprites'

export interface UsePokemonDataResult {
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
