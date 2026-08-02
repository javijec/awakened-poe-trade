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
    exposePriceCheckBenchmark()
    return
  }

  await initConfig()
  const i18nPlugin = await I18n.init(AppConfig().language)
  await Data.init(AppConfig().language)
  await Host.init()

  watch(() => AppConfig().language, async () => {
    await Data.loadForLang(AppConfig().language)
    await I18n.loadLang(AppConfig().language)
  })

  createApp(App)
    .use(i18nPlugin)
    .mount('#app')
})()
