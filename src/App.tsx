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
      <main className="pb-16 px-4 max-w-[1400px] mx-auto">
        <div className="flex gap-8 items-start">
          <div className="flex-none w-[720px]">
            <PokemonSelector
              allPokemon={pokemon}
              selectedPokemon={selected}
              onSelect={setSelected}
            />
          </div>

          <div className="flex-1 min-w-0">
            {selected && results.length > 0 && (
              <CompatibilityResults
                results={results}
                selectedName={selected.name}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
