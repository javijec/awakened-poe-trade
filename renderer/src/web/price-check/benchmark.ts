import { parseClipboard } from '@/parser'
import { createPresets } from './filters/create-presets'
import { createTradeRequest } from './trade/pathofexile-trade'
import { PRICE_CHECK_BENCHMARK_FIXTURES } from './benchmark-fixtures'
import { preparePriceCheck } from './worker-client'

export interface PriceCheckBenchmarkSummary {
  average: number
  p50: number
  p95: number
  min: number
  max: number
}

export interface PriceCheckBenchmarkReport {
  iterations: number
  fixtures: string[]
  stages: Record<'parse' | 'presets' | 'tradeRequest' | 'total', PriceCheckBenchmarkSummary>
}

const options = {
  league: 'Standard',
  currency: undefined,
  collapseListings: 'api' as const,
  activateStockFilter: false,
  searchStatRange: 10,
  useEn: true
}

// A single local stage often takes less than the browser timer resolution.
// Time a small batch and normalize it to retain meaningful p50/p95 values.
const BATCH_SIZE = 25

function summarize (samples: number[]): PriceCheckBenchmarkSummary {
  const sorted = [...samples].sort((a, b) => a - b)
  const percentile = (ratio: number) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1)]
  const sum = samples.reduce((total, value) => total + value, 0)
  return {
    average: sum / samples.length,
    p50: percentile(0.5),
    p95: percentile(0.95),
    min: sorted[0],
    max: sorted[sorted.length - 1]
  }
}

/** Runs in the initialized renderer, using the same data and code as price check. */
export function runPriceCheckBenchmark (iterations = 100): PriceCheckBenchmarkReport {
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error('iterations must be a positive integer')
  }

  const parse: number[] = []
  const presets: number[] = []
  const tradeRequest: number[] = []
  const total: number[] = []

  // Warm up JIT and data lookup paths without polluting the report.
  for (const fixture of PRICE_CHECK_BENCHMARK_FIXTURES) {
    const item = parseClipboard(fixture.clipboard).unwrapOr(null)
    if (item) createPresets(item, options)
  }

  for (let iteration = 0; iteration < iterations; iteration++) {
    for (const fixture of PRICE_CHECK_BENCHMARK_FIXTURES) {
      const startedAt = performance.now()
      const parseStartedAt = performance.now()
      const parsedItems = []
      for (let batch = 0; batch < BATCH_SIZE; batch++) {
        const parsed = parseClipboard(fixture.clipboard)
        if (parsed.isErr()) {
          throw new Error(`Benchmark fixture "${fixture.name}" did not parse: ${parsed.error}`)
        }
        parsedItems.push(parsed.value)
      }
      parse.push((performance.now() - parseStartedAt) / BATCH_SIZE)

      const presetsStartedAt = performance.now()
      const createdPresets = parsedItems.map(item => createPresets(item, options))
      presets.push((performance.now() - presetsStartedAt) / BATCH_SIZE)

      const requestStartedAt = performance.now()
      for (const created of createdPresets) {
        for (const preset of created.presets) {
          createTradeRequest(preset.filters, preset.stats)
        }
      }
      tradeRequest.push((performance.now() - requestStartedAt) / BATCH_SIZE)
      total.push((performance.now() - startedAt) / BATCH_SIZE)
    }
  }

  return {
    iterations,
    fixtures: PRICE_CHECK_BENCHMARK_FIXTURES.map(fixture => fixture.name),
    stages: {
      parse: summarize(parse),
      presets: summarize(presets),
      tradeRequest: summarize(tradeRequest),
      total: summarize(total)
    }
  }
}

declare global {
  interface Window {
    __AWAKENED_PRICE_CHECK_BENCHMARK__?: PriceCheckBenchmarkReport
    __AWAKENED_PRICE_CHECK_WORKER_SMOKE__?: { presets: number } | { error: string }
  }
}

export async function exposePriceCheckBenchmark () {
  const report = runPriceCheckBenchmark()
  window.__AWAKENED_PRICE_CHECK_BENCHMARK__ = report
  try {
    const prepared = await preparePriceCheck(PRICE_CHECK_BENCHMARK_FIXTURES[0].clipboard, 'en', options)
    window.__AWAKENED_PRICE_CHECK_WORKER_SMOKE__ = {
      presets: prepared.presets.length
    }
  } catch (error) {
    window.__AWAKENED_PRICE_CHECK_WORKER_SMOKE__ = { error: (error as Error).message }
  }
  document.documentElement.dataset.priceCheckBenchmark = JSON.stringify(report)
  document.documentElement.dataset.priceCheckWorkerSmoke = JSON.stringify(window.__AWAKENED_PRICE_CHECK_WORKER_SMOKE__)
  console.table(Object.entries(report.stages).map(([stage, summary]) => ({ stage, ...summary })))
  window.dispatchEvent(new CustomEvent('awakened:price-check-benchmark', { detail: report }))
  return report
}
