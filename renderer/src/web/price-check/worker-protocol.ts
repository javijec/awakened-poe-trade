import type { ParsedItem } from '@/parser'
import type { FilterPreset } from './filters/interfaces'
import type { PriceCheckCreateOptions } from './filters/create-presets'

export interface PreparedPriceCheck {
  item: ParsedItem
  presets: FilterPreset[]
  active: string
  timings: { parse: number, presets: number }
}

export type PriceCheckWorkerRequest =
  | { type: 'prepare', id: number, clipboard: string, language: string, options: PriceCheckCreateOptions }

export type PriceCheckWorkerResponse =
  | { type: 'prepared', id: number, value: PreparedPriceCheck }
  | { type: 'error', id: number, message: string }
