import type { BreakdownItem } from '../../types/pokemon'

interface BreakdownPillsProps {
  breakdown: BreakdownItem[]
}

const PILL_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'habitat-match': { bg: '#FFDE0015', text: '#FFDE00', border: '#FFDE0055' },
  'habitat-clash': { bg: '#FF000015', text: '#FF6666', border: '#FF000055' },
  'trait-match':   { bg: '#3B4CCA15', text: '#8899ff', border: '#3B4CCA55' },
  'trait-clash':   { bg: '#CC000015', text: '#ff8888', border: '#CC000055' },
}

export function BreakdownPills({ breakdown }: BreakdownPillsProps) {
  if (breakdown.length === 0) {
    return <p className="text-gray-600 text-xs italic">No compatibility factors.</p>
  }

  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {breakdown.map((item, i) => {
        const style = PILL_STYLES[item.type] ?? PILL_STYLES['trait-match']
        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          >
            <span>{item.points > 0 ? '+' : ''}{item.points}</span>
            <span>{item.label}</span>
          </span>
        )
      })}
    </div>
  )
}
