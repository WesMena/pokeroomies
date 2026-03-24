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
    <section className="w-full">
      <h2 className="text-[#FFDE00] text-base font-bold mb-4 uppercase tracking-widest">
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

    </section>
  )
}
