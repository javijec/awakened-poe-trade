import { createApp, watch } from 'vue'
import App from './web/App.vue'
import * as I18n from './web/i18n'
import * as Data from './assets/data'
import { initConfig, AppConfig, defaultConfig, updateConfig } from './web/Config'
import { Host } from './web/background/IPC'

;(async function () {
  if (new URLSearchParams(window.location.search).get('benchmark') === 'price-check') {
    // The benchmark is intentionally independent of the local Electron host:
    // it measures deterministic renderer work only, with the normal item data.
    updateConfig(defaultConfig())
    await Data.init('en')
    const { exposePriceCheckBenchmark } = await import('./web/price-check/benchmark')
    await exposePriceCheckBenchmark()
    return
  }

  // Configuration and the renderer transport do not depend on the game data.
  // Start both immediately so mounting the overlay is not held up by the much
  // larger item/stat data files.
  const configReady = initConfig()
  const hostReady = Host.init()
  await configReady
  const i18nPlugin = await I18n.init(AppConfig().language)
  await hostReady

  createApp(App)
    .use(i18nPlugin)
    .mount('#app')

  // Item and stat indexes are only needed when a feature parses an item. Let
  // the overlay become usable first, then warm them without blocking a window.
  const dataReady = Data.init(AppConfig().language)
  dataReady.then(async () => {
    const { warmPriceCheckWorker } = await import('./web/price-check/worker-client')
    const warm = () => warmPriceCheckWorker(AppConfig().language)
    const idle = (globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: () => void, options: { timeout: number }) => number
    }).requestIdleCallback
    if (idle) {
      idle(warm, { timeout: 2_000 })
    } else {
      setTimeout(warm, 250)
    }
  }).catch((error) => {
    // Keep the application interactive: a price check will surface its own
    // actionable error if these optional background assets cannot be loaded.
    console.error('Failed to preload item data', error)
  })

  watch(() => AppConfig().language, async () => {
    await dataReady
    await Promise.all([
      Data.loadForLang(AppConfig().language),
      I18n.loadLang(AppConfig().language)
    ])
  })
})()
