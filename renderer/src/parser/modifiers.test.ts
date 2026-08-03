import { describe, expect, it } from 'vitest'
import { sumStatsByModType, ModifierType } from './modifiers'
import type { ParsedModifier } from './advanced-mod-desc'
import type { Stat, StatMatcher } from '@/assets/data'

const stat = { ref: '#% increased effect' } as Stat

function modifier (rollIncr: number | undefined, value: number): ParsedModifier {
  return {
    info: { type: ModifierType.Explicit, tags: [], rollIncr },
    stats: [{
      stat,
      translation: {} as StatMatcher,
      roll: { value, min: value, max: value, dp: false, unscalable: false }
    }]
  }
}

describe('sumStatsByModType', () => {
  it('can preserve tooltip rolls that already include Tincture effect', () => {
    const effect = modifier(20, 20)

    expect(sumStatsByModType([effect])[0].sources[0].contributes?.value).toBe(24)
    expect(sumStatsByModType([effect], false)[0].sources[0].contributes?.value).toBe(20)
  })
})
