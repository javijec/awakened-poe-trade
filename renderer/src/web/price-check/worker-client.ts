import type { PriceCheckCreateOptions } from './filters/create-presets'
import type { PreparedPriceCheck, PriceCheckWorkerResponse } from './worker-protocol'

let nextRequestId = 1
let worker: Worker | undefined
const pending = new Map<number, {
  resolve: (value: PreparedPriceCheck) => void
  reject: (error: Error) => void
  timeout: ReturnType<typeof setTimeout>
}>()

function getWorker () {
  if (worker) return worker

  worker = new Worker(new URL('./price-check.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event: MessageEvent<PriceCheckWorkerResponse>) => {
    const response = event.data
    const request = pending.get(response.id)
    if (!request) return
    pending.delete(response.id)
    clearTimeout(request.timeout)
    if (response.type === 'prepared') request.resolve(response.value)
    else request.reject(new Error(response.message))
  }
  worker.onerror = (event) => {
    const error = new Error(event.message || 'Price check worker failed')
    for (const request of pending.values()) {
      clearTimeout(request.timeout)
      request.reject(error)
    }
    pending.clear()
    worker?.terminate()
    worker = undefined
  }
  return worker
}

export function preparePriceCheck (
  clipboard: string,
  language: string,
  options: PriceCheckCreateOptions
): Promise<PreparedPriceCheck> {
  const id = nextRequestId++
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!pending.delete(id)) return
      reject(new Error('Price check worker timed out'))
    }, 10_000)
    pending.set(id, { resolve, reject, timeout })
    getWorker().postMessage({ type: 'prepare', id, clipboard, language, options })
  })
}
