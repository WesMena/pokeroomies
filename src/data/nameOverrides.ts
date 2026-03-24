/**
 * Maps the name as it appears in pokemon.json → correct PokeAPI slug.
 * Only entries that differ need to be listed here.
 */
export const NAME_OVERRIDES: Record<string, string> = {
  // Typos in pokemon.json
  'Venasaur': 'venusaur',
  'Ramparados': 'rampardos',
  'Kyorgre': 'kyogre',
  'Floragto': 'floragato',

  // Special characters
  'Ho-Oh': 'ho-oh',
  'Mr. Mime': 'mr-mime',
  'Farfetch\u2019d': 'farfetchd',   // curly right-quote  '
  "Farfetch'd": 'farfetchd',         // straight apostrophe fallback
  'Nidoran♀': 'nidoran-f',
  'Nidoran♂': 'nidoran-m',

  // Regional / form variants — map to base sprite
  'Shellos W': 'shellos',
  'Shellos E': 'shellos',
  'Gastrodon W': 'gastrodon',
  'Gastrodon E': 'gastrodon',
  'Paldean Wooper': 'wooper-paldea',
  'Stereo Rotom': 'rotom-fan',

  // Tatsugiri forms
  'Tatsugiri Curly': 'tatsugiri-curly',
  'Tatsugiri Droopy': 'tatsugiri-droopy',
  'Tatsugiri Stretchy': 'tatsugiri-stretchy',

  // Toxtricity forms
  'Toxtricity Amped': 'toxtricity-amped',
  'Toxtricity Low Key': 'toxtricity-low-key',

  // Mimikyu — PokeAPI only has the disguised form
  'Mimikyu': 'mimikyu-disguised',
}
