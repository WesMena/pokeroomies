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
