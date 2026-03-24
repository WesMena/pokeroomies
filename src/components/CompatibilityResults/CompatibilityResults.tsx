import { useState } from 'react'
import type { CompatibilityResult } from '../../types/pokemon'
import { ResultRow } from './ResultRow'

interface CompatibilityResultsProps {
  results: CompatibilityResult[]
  selectedName: string
}

export function CompatibilityResults({
  results,
  selectedName,
}: CompatibilityResultsProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)

  function toggleExpand(name: string) {
    setExpandedName(prev => (prev === name ? null : name))
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-10">
      <h2 className="text-[#FFDE00] text-sm font-bold mb-1 uppercase tracking-widest">
        Best roommates for {selectedName}
      </h2>
      <p className="text-gray-500 text-xs mb-4">
        {results.length} Pokémon ranked by compatibility
      </p>

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
