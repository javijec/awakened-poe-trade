/// <reference lib="webworker" />

import * as Data from '@/assets/data'
import { parseClipboard } from '@/parser'
import { createPresets } from './filters/create-presets'
import type { PriceCheckWorkerRequest, PriceCheckWorkerResponse } from './worker-protocol'

let language: string | undefined

async function ensureData (nextLanguage: string) {
  if (language == null) await Data.init(nextLanguage)
  else if (language !== nextLanguage) await Data.loadForLang(nextLanguage)
  language = nextLanguage
}

self.onmessage = async (event: MessageEvent<PriceCheckWorkerRequest>) => {
  const request = event.data
  try {
    await ensureData(request.language)
    if (request.type === 'warm') return

    const parseStartedAt = performance.now()
    const parsed = parseClipboard(request.clipboard)
    const parse = performance.now() - parseStartedAt
    if (parsed.isErr()) throw new Error(`${parsed.error}`)

    const presetsStartedAt = performance.now()
    const prepared = createPresets(parsed.value, request.options)
    const presets = performance.now() - presetsStartedAt

    const response: PriceCheckWorkerResponse = {
      type: 'prepared',
      id: request.id,
      value: {
        item: parsed.value,
        presets: prepared.presets,
        active: prepared.active,
        timings: { parse, presets }
      }
    }
    self.postMessage(response)
  } catch (error) {
    // A warm-up failure is non-fatal and has no caller waiting for a response.
    if (request.type === 'prepare') {
      self.postMessage({ type: 'error', id: request.id, message: (error as Error).message } satisfies PriceCheckWorkerResponse)
    }
  }
}
