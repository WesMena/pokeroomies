import { useState } from 'react'
import type { CompatibilityResult } from '../../types/pokemon'
import { ResultRow } from './ResultRow'

interface CompatibilityResultsProps {
  results: CompatibilityResult[]
  selectedName: string
  selectedSpriteUrl?: string
}

export function CompatibilityResults({
  results,
  selectedName,
  selectedSpriteUrl,
}: CompatibilityResultsProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)

  function toggleExpand(name: string) {
    setExpandedName(prev => (prev === name ? null : name))
  }

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-1">
        {selectedSpriteUrl && (
          <img
            src={selectedSpriteUrl}
            alt={selectedName}
            className="w-12 h-12 object-contain flex-shrink-0"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
        <div>
          <h2 className="text-[#FFDE00] text-sm font-bold uppercase tracking-widest">
            Best roommates for {selectedName}
          </h2>
          <p className="text-gray-500 text-xs">
            {results.length} Pokémon ranked by compatibility
          </p>
        </div>
      </div>
      <div className="mb-4" />

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
