import { useState, useRef, useEffect } from 'react'
import type { Pokemon } from '../../types/pokemon'

interface SearchBarProps {
  allPokemon: Pokemon[]
  onSelect: (pokemon: Pokemon) => void
  onSearchChange: (query: string) => void
}

export function SearchBar({ allPokemon, onSelect, onSearchChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestions = query.trim().length > 0
    ? allPokemon
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : []

  function handleChange(value: string) {
    setQuery(value)
    onSearchChange(value)
    setShowSuggestions(true)
  }

  function handleSelect(pokemon: Pokemon) {
    setQuery(pokemon.name)
    setShowSuggestions(false)
    onSearchChange('')  // clear grid filter after selection
    onSelect(pokemon)
  }

  function handleClear() {
    setQuery('')
    onSearchChange('')
    setShowSuggestions(false)
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-[#1a1a1a] border-2 border-[#3B4CCA] rounded-lg px-3 py-2 focus-within:border-[#FF0000] transition-colors">
        <span className="text-[#FFDE00]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search Pokémon..."
          className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500"
        />
        {query && (
          <button onClick={handleClear} className="text-gray-400 hover:text-white text-xs">
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#3B4CCA] rounded-lg overflow-hidden shadow-xl">
          {suggestions.map(pokemon => (
            <li key={pokemon.name}>
              <button
                onMouseDown={() => handleSelect(pokemon)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#2a1a1a] hover:border-l-2 hover:border-[#FF0000] transition-colors text-left"
              >
                {pokemon.spriteUrl && (
                  <img
                    src={pokemon.spriteUrl}
                    alt=""
                    className="w-8 h-8 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
                <span className="text-sm text-white">{pokemon.name}</span>
                {pokemon.habitat && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#3B4CCA22', color: '#3B4CCA', border: '1px solid #3B4CCA55' }}>
                    {pokemon.habitat}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
