export interface PriceCheckBenchmarkFixture {
  name: string
  clipboard: string
}

// Copied-item format, covering a stackable item, a unique and a rare with mods.
// Keep this corpus small and representative: it runs in the actual renderer on
// every benchmark invocation.
export const PRICE_CHECK_BENCHMARK_FIXTURES: PriceCheckBenchmarkFixture[] = [
  {
    name: 'currency-stack',
    clipboard: `Item Class: Stackable Currency
Rarity: Currency
Chaos Orb
--------
Stack Size: 10/20
--------
`
  },
  {
    name: 'unique-ring',
    clipboard: `Item Class: Rings
Rarity: Unique
Ventor's Gamble
Gold Ring
--------
Requirements:
Level: 65
--------
Item Level: 85
--------
+6% to all Elemental Resistances
--------
`
  },
  {
    name: 'rare-body-armour',
    clipboard: `Item Class: Body Armours
Rarity: Rare
Doom Veil
Vaal Regalia
--------
Energy Shield: 240 (augmented)
--------
Requirements:
Level: 68
Int: 194
--------
Sockets: B-B-B-B-B-B
--------
Item Level: 84
--------
+100 to maximum Energy Shield
+40% to Fire Resistance
+40% to Cold Resistance
+40% to Lightning Resistance
--------
`
  }
]
