import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const languages = ['en', 'ru', 'cmn-Hant', 'ko']

describe('thematic UI translations', () => {
  it('defines the price-check state copy for every supported language', () => {
    for (const language of languages) {
      const source = readFileSync(resolve(process.cwd(), `public/data/${language}/app_i18n.json`), 'utf8')
      const messages = JSON.parse(source) as { price_check?: Record<string, string> }

      expect(messages.price_check?.preparing).toBeTypeOf('string')
      expect(messages.price_check?.league_required).toBeTypeOf('string')
      expect(messages.price_check?.select_league).toBeTypeOf('string')
    }
  })
})
