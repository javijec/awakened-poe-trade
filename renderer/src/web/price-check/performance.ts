export type PriceCheckStage = 'parse' | 'presets' | 'trade-request' | 'first-paint'

export interface PriceCheckProfile {
  id: number
  source: string
  startedAt: number
  stages: Partial<Record<PriceCheckStage, number>>
  total?: number
}

const MAX_PROFILES = 100
let nextProfileId = 1
const profiles = new Map<number, PriceCheckProfile>()

function isEnabled () {
  return import.meta.env.DEV ||
    new URLSearchParams(window.location.search).has('benchmark') ||
    window.localStorage.getItem('awakened:price-check-performance') === '1'
}

export function beginPriceCheckProfile (source: string): number | undefined {
  if (!isEnabled()) return undefined

  const id = nextProfileId++
  profiles.set(id, { id, source, startedAt: performance.now(), stages: {} })
  if (profiles.size > MAX_PROFILES) {
    profiles.delete(profiles.keys().next().value!)
  }
  return id
}

export function measurePriceCheckStage<T> (
  id: number | undefined,
  stage: PriceCheckStage,
  fn: () => T
): T {
  if (id == null) return fn()

  const startedAt = performance.now()
  try {
    return fn()
  } finally {
    const profile = profiles.get(id)
    if (profile) profile.stages[stage] = performance.now() - startedAt
  }
}

export function recordPriceCheckStage (
  id: number | undefined,
  stage: Exclude<PriceCheckStage, 'first-paint'>,
  duration: number
) {
  if (id == null) return
  const profile = profiles.get(id)
  if (profile) profile.stages[stage] = duration
}

export function finishPriceCheckProfile (id: number | undefined) {
  if (id == null) return

  requestAnimationFrame(() => {
    const profile = profiles.get(id)
    if (!profile) return

    profile.stages['first-paint'] = performance.now() - profile.startedAt
    profile.total = profile.stages['first-paint']
    window.dispatchEvent(new CustomEvent('awakened:price-check-profile', { detail: profile }))
  })
}

export function getPriceCheckProfiles () {
  return [...profiles.values()].map(profile => ({
    ...profile,
    stages: { ...profile.stages }
  }))
}
