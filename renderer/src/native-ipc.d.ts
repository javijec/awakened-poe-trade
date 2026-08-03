import type { HostState, MainToRendererEvent, RendererToMainEvent } from '../../ipc/types'

declare global {
  interface Window {
    awakenedNative?: {
      send: (event: RendererToMainEvent) => void
      onEvent: (listener: (event: MainToRendererEvent) => void) => () => void
      getHostState: () => Promise<HostState>
    }
  }
}

export {}
