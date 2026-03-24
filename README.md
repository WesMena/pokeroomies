# Pokéroomies

A companion tool for **Pokémon Pokopia** players to find their perfect Pokémon roommate.

Select your Pokémon and instantly see all 303 housemates ranked by compatibility — based on shared habitat and personality traits pulled straight from the Pokopia housemate roster.

---

## What it does

- **Browse & search** the full Pokopia housemate roster (303 Pokémon)
- **Select your Pokémon** to see how compatible every other housemate is with yours
- **Ranked results** with a full score breakdown for each candidate
- **Top 3 podium** — gold, silver, and bronze highlights for your best matches
- Sprites fetched live from PokéAPI

## Scoring system

Compatibility is calculated from your selected Pokémon's perspective:

| Factor | Points |
|---|---|
| Same habitat | +20 |
| Incompatible habitat (Bright/Dark, Warm/Cool, Humid/Dry) | −20 |
| Each shared trait | +5 |
| Each clashing trait pair (Cleanliness/Garbage, Noisy/Watching, Hard/Soft, Spooky/Healing) | −5 |
| No habitat (either side) | 0 |

## Tech stack

- [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/) — dev server & build
- [Tailwind CSS v3](https://tailwindcss.com/) — utility-first styling with dynamic inline styles
- [PokéAPI](https://pokeapi.co/) — sprite resolution at startup
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — unit tests for the compatibility engine

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm test       # run unit tests
npm run build  # production build
```

## Project structure

```
src/
├── components/
│   ├── CompatibilityResults/   # Ranked results list with breakdown pills
│   ├── PokemonSelector/        # Search bar + scrollable card grid
│   └── Header.tsx
├── data/
│   ├── compatibilityRules.ts   # Scoring constants & clash pairs
│   └── nameOverrides.ts        # JSON name → PokéAPI slug mappings
├── engine/
│   └── compatibility.ts        # Pure scoring function (fully tested)
├── hooks/
│   ├── useCompatibility.ts     # Memoized ranked results
│   └── usePokemonData.ts       # Data fetch + sprite resolution
├── types/
│   └── pokemon.ts
└── utils/
    └── sprites.ts              # Name normalisation & habitat colours
public/
└── pokemon.json                # 303 Pokopia housemates
```
