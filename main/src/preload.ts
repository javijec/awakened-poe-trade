import { contextBridge, ipcRenderer } from 'electron'
import type { HostState, IpcEvent, MainToRendererEvent, RendererToMainEvent } from '@awakened/ipc/types'

contextBridge.exposeInMainWorld('awakenedNative', {
  send (event: RendererToMainEvent) {
    ipcRenderer.send('awakened:event', event)
  },
  onEvent (listener: (event: MainToRendererEvent) => void) {
    const handler = (_event: Electron.IpcRendererEvent, event: IpcEvent) => listener(event as MainToRendererEvent)
    ipcRenderer.on('awakened:event', handler)
    return () => ipcRenderer.removeListener('awakened:event', handler)
  },
  getHostState: () => ipcRenderer.invoke('awakened:get-host-state') as Promise<HostState>
})
