import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const vuePlugin = () => vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'webview'
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    assetsInlineLimit: 0
  },
  plugins: [
    vuePlugin()
  ],
  worker: {
    format: 'es',
    plugins: () => [vuePlugin()]
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@ipc': path.resolve(import.meta.dirname, './src/../../ipc')
    }
  },
  server: {
    proxy: {
      '^/(config|uploads|proxy)': { target: 'http://127.0.0.1:8584' },
      '/events': { ws: true, target: 'http://127.0.0.1:8584' }
    }
  }
})
