import type { CompatibilityResult } from '../../types/pokemon'
import { BreakdownPills } from './BreakdownPills'
import { getHabitatColor } from '../../utils/sprites'

interface ResultRowProps {
  result: CompatibilityResult
  rank: number
  expanded: boolean
  onToggle: () => void
}

const PODIUM: Record<number, { color: string; bg: string; glow: string }> = {
  1: { color: '#FFD700', bg: '#2a2200', glow: '#FFD70033' },
  2: { color: '#C0C0C0', bg: '#1e1e1e', glow: '#C0C0C033' },
  3: { color: '#CD7F32', bg: '#1e1408', glow: '#CD7F3233' },
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
  const podium = PODIUM[rank]

  const bgColor = podium ? podium.bg : '#11191e'
  const boxShadow = podium ? `0 0 12px ${podium.glow}` : undefined
  const borderLeft = podium ? `8px solid ${podium.color}` : `1px solid ${habitatColor}44`
  const borderOther = podium ? `1px solid ${podium.color}44` : `1px solid ${habitatColor}44`

  return (
    <div
      className={`rounded-lg overflow-hidden transition-opacity duration-200 ${isDimmed ? 'opacity-50 hover:opacity-80' : ''}`}
      style={{
        borderLeft,
        borderTop: borderOther,
        borderRight: borderOther,
        borderBottom: borderOther,
        backgroundColor: bgColor,
        boxShadow,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        {/* Rank */}
        {podium ? (
          <span className="text-xs w-6 text-center flex-shrink-0 font-bold" style={{ color: podium.color }}>#{rank}</span>
        ) : (
          <span className="text-gray-600 text-xs w-6 text-center flex-shrink-0">#{rank}</span>
        )}

        {/* Sprite */}
        {pokemon.spriteUrl ? (
          <img
            src={pokemon.spriteUrl}
            alt={pokemon.name}
            className={`object-contain flex-shrink-0 ${podium ? 'w-14 h-14' : 'w-10 h-10'}`}
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className={`rounded-full flex-shrink-0 ${podium ? 'w-14 h-14' : 'w-10 h-10'}`}
            style={{ backgroundColor: habitatColor + '22' }} />
        )}

        {/* Name + Habitat */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate ${podium ? 'text-base' : 'text-sm text-white'}`}
            style={{ color: podium ? podium.color : 'white' }}
          >
            {pokemon.name}
          </p>
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
        <div className="px-4 pb-4 border-t" style={{ borderColor: podium ? podium.color + '33' : habitatColor + '33' }}>
          <BreakdownPills breakdown={breakdown} />
        </div>
      )}
    </div>
  )
}
