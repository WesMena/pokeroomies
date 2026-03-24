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
