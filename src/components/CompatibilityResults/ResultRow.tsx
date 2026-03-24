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
