import { describe, expect, it, vi } from 'vitest'
import { ItemCategory, ItemRarity, parseClipboard } from '@/parser'
import { createVirtualItem } from '@/parser/ParsedItem'
import { createPresets } from './filters/create-presets'
import { createTradeRequest } from './trade/pathofexile-trade'
import type { BaseType } from '@/assets/data'

vi.mock('@/web/Config', () => ({
  AppConfig: () => ({ language: 'en', realm: 'pc-ggg' }),
  poeWebApi: () => 'www.pathofexile.com'
}))

const options = {
  league: 'Standard',
  currency: undefined,
  collapseListings: 'api' as const,
  activateStockFilter: false,
  searchStatRange: 10,
  useEn: true
}

describe('price check contract', () => {
  it('rejects malformed copied text without throwing', () => {
    expect(parseClipboard('not an item')).toMatchObject({ isErr: expect.any(Function) })
  })

  it('turns a parsed item shape into presets and a trade query', () => {
    const item = createVirtualItem({
      category: ItemCategory.Currency,
      rarity: ItemRarity.Normal,
      stackSize: { value: 10, max: 20 },
      info: {
        namespace: 'ITEM',
        name: 'Chaos Orb',
        refName: 'Chaos Orb',
        icon: 'chaos.png',
        craftable: false,
        exchangeable: true
      } as unknown as BaseType
    })

    const prepared = createPresets(item, options)
    const active = prepared.presets.find(preset => preset.id === prepared.active)!
    const request = createTradeRequest(active.filters, active.stats)

    expect(prepared.presets).toHaveLength(1)
    expect(request.query.status.option).toBe('available')
    expect(request.query.stats).toHaveLength(1)
  })
})
