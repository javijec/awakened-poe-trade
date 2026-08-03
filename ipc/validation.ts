import type { IpcEvent, RendererToMainEvent } from './types'

const inboundNames = new Set<RendererToMainEvent['name']>([
  'OVERLAY->MAIN::focus-game',
  'OVERLAY->MAIN::track-area',
  'CLIENT->MAIN::update-host-config',
  'CLIENT->MAIN::used-recently',
  'CLIENT->MAIN::save-config',
  'CLIENT->MAIN::user-action'
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

/** Rejects malformed renderer messages before they reach the main event bus. */
export function isRendererToMainEvent (value: unknown): value is RendererToMainEvent {
  if (!isRecord(value) || typeof value.name !== 'string' || !inboundNames.has(value.name as RendererToMainEvent['name'])) return false

  switch (value.name) {
    case 'OVERLAY->MAIN::focus-game': return value.payload === undefined
    case 'CLIENT->MAIN::used-recently': return isRecord(value.payload) && typeof value.payload.isOverlay === 'boolean'
    case 'CLIENT->MAIN::save-config': return isRecord(value.payload) && typeof value.payload.contents === 'string' && typeof value.payload.isTemporary === 'boolean'
    case 'CLIENT->MAIN::user-action':
      return isRecord(value.payload) && (
        value.payload.action === 'check-for-update' ||
        value.payload.action === 'update-and-restart' ||
        value.payload.action === 'quit' ||
        (value.payload.action === 'stash-search' && typeof value.payload.text === 'string')
      )
    case 'OVERLAY->MAIN::track-area': {
      const payload = value.payload
      return isRecord(payload) && typeof payload.holdKey === 'string' && isNumber(payload.closeThreshold) && isNumber(payload.dpr) &&
        isRecord(payload.from) && isNumber(payload.from.x) && isNumber(payload.from.y) &&
        isRecord(payload.area) && isNumber(payload.area.x) && isNumber(payload.area.y) && isNumber(payload.area.width) && isNumber(payload.area.height)
    }
    case 'CLIENT->MAIN::update-host-config': {
      const payload = value.payload
      return isRecord(payload) && Array.isArray(payload.shortcuts) &&
        typeof payload.restoreClipboard === 'boolean' && typeof payload.stashScroll === 'boolean' &&
        typeof payload.overlayKey === 'string' && typeof payload.logKeys === 'boolean' &&
        typeof payload.windowTitle === 'string' && typeof payload.language === 'string' &&
        (typeof payload.clientLog === 'string' || payload.clientLog === null) &&
        (typeof payload.gameConfig === 'string' || payload.gameConfig === null)
    }
  }
  return false
}

export function isIpcEvent (value: unknown): value is IpcEvent {
  return isRecord(value) && typeof value.name === 'string' && 'payload' in value
}
