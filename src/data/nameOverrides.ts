/**
 * Maps the name as it appears in pokemon.json → correct PokeAPI slug.
 * Only entries that differ need to be listed here.
 */
export const NAME_OVERRIDES: Record<string, string> = {
  'Venasaur': 'venusaur',
  'Ho-Oh': 'ho-oh',
  'Mr. Mime': 'mr-mime',
  "Farfetch'd": 'farfetchd',
  'Nidoran♀': 'nidoran-f',
  'Nidoran♂': 'nidoran-m',
}
