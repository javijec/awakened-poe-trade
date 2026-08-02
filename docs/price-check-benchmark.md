# Price check benchmark

Run this from `renderer` after installing dependencies and generating the data indexes:

```powershell
pnpm make-index-files
pnpm benchmark:price-check
```

The browser opens the real renderer with `?benchmark=price-check`. Once its item
database has loaded, the benchmark runs 100 iterations over currency, unique and
rare item clipboard payloads. It reports milliseconds for `parse`, `presets`,
`tradeRequest` and the three local stages together as `total`.

Read the `console.table` output or `window.__AWAKENED_PRICE_CHECK_BENCHMARK__`
in DevTools. The report includes average, p50, p95, min and max, so compare p95
between revisions rather than a single run.

The normal price-check flow also emits `awakened:price-check-profile` while
running in development, with `?benchmark` in the URL, or when local storage key
`awakened:price-check-performance` is set to `1`. This measures actual
clipboard parsing, preset creation and the first render frame without collecting
variable remote trade-API network time.
