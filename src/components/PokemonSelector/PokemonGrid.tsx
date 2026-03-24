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
      className="overflow-y-auto overflow-x-visible max-h-[620px] pr-1 pl-1"
      style={{ scrollbarColor: '#FF0000 #11191e', scrollbarWidth: 'thin' }}
    >
      <div className="flex flex-wrap gap-2 justify-start pt-1">
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
