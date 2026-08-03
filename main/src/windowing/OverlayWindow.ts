import path from 'path'
import { BrowserWindow, dialog, shell, Menu, WebContents } from 'electron'
import { OverlayController, OVERLAY_WINDOW_OPTS } from 'electron-overlay-window'
import type { ServerEvents } from '../server'
import type { Logger } from '../RemoteLogger'
import type { GameWindow } from './GameWindow'

const TRADE_HOSTS = new Set(['www.pathofexile.com', 'ru.pathofexile.com', 'pathofexile.tw', 'poe.kakaogames.com'])
const EXTERNAL_HOSTS = new Set([...TRADE_HOSTS, 'poe.ninja', 'www.poewiki.net', 'poedb.tw', 'craftofexile.com', 'snosme.github.io', 'patreon.com'])

function hasAllowedHost (url: string, hosts: Set<string>) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && hosts.has(parsed.hostname)
  } catch {
    return false
  }
}

export class OverlayWindow {
  public isInteractable = false
  public wasUsedRecently = true
  private window?: BrowserWindow
  private overlayKey: string = 'Shift + Space'
  private isOverlayKeyUsed = false

  get webContents () { return this.window?.webContents }

  constructor (
    private server: ServerEvents,
    private logger: Logger,
    private poeWindow: GameWindow,
  ) {
    this.server.onEventAnyClient('OVERLAY->MAIN::focus-game', this.assertGameActive)
    this.poeWindow.on('active-change', this.handlePoeWindowActiveChange)
    this.poeWindow.onAttach(this.handleOverlayAttached)

    this.server.onEventAnyClient('CLIENT->MAIN::used-recently', (e) => {
      this.wasUsedRecently = e.isOverlay
    })

    if (process.argv.includes('--no-overlay')) return

    this.window = new BrowserWindow({
      icon: path.join(__dirname, process.env.STATIC!, 'icon.png'),
      ...OVERLAY_WINDOW_OPTS,
      width: 800,
      height: 600,
      webPreferences: {
        allowRunningInsecureContent: false,
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js'),
        webviewTag: true,
        spellcheck: false
      }
    })

    this.window.setMenu(Menu.buildFromTemplate([
      { role: 'editMenu' },
      { role: 'reload' },
      { role: 'toggleDevTools' }
    ]))

    this.window.webContents.on('before-input-event', this.handleExtraCommands)
    this.window.webContents.on('did-attach-webview', (_, webviewWebContents) => {
      webviewWebContents.on('before-input-event', this.handleExtraCommands)
      webviewWebContents.on('will-navigate', (event, url) => {
        if (!hasAllowedHost(url, TRADE_HOSTS)) event.preventDefault()
      })
    })

    this.window.webContents.on('will-attach-webview', (event, webPreferences, params) => {
      if (!hasAllowedHost(params.src, TRADE_HOSTS)) {
        event.preventDefault()
        return
      }
      webPreferences.nodeIntegration = false
      webPreferences.contextIsolation = true
      webPreferences.sandbox = true
      delete webPreferences.preload
      params.allowpopups = 'false'
    })

    this.window.webContents.on('will-navigate', (event, url) => {
      if (!this.isOverlayUrl(url)) event.preventDefault()
    })

    this.window.webContents.setWindowOpenHandler((details) => {
      if (hasAllowedHost(details.url, EXTERNAL_HOSTS)) shell.openExternal(details.url)
      return { action: 'deny' }
    })
  }

  loadAppPage (port: number) {
    const url = process.env.VITE_DEV_SERVER_URL ||
      `http://localhost:${port}/index.html`

    if (!this.window) {
      shell.openExternal(url)
      return
    }

    if (process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(url)
      this.window.webContents.openDevTools({ mode: 'detach', activate: false })
    } else {
      this.window.loadURL(url)
    }
  }

  private isOverlayUrl (url: string) {
    const expected = process.env.VITE_DEV_SERVER_URL || 'http://localhost'
    return url.startsWith(expected)
  }

  assertOverlayActive = () => {
    if (!this.isInteractable) {
      this.isInteractable = true
      OverlayController.activateOverlay()
      this.poeWindow.isActive = false
    }
  }

  assertGameActive = () => {
    if (this.isInteractable) {
      this.isInteractable = false
      OverlayController.focusTarget()
      this.poeWindow.isActive = true
    }
  }

  toggleActiveState = () => {
    this.isOverlayKeyUsed = true
    if (this.isInteractable) {
      this.assertGameActive()
    } else {
      this.assertOverlayActive()
    }
  }

  updateOpts (overlayKey: string, windowTitle: string) {
    this.overlayKey = overlayKey
    this.poeWindow.attach(this.window, windowTitle)
  }

  private handleExtraCommands = (event: Electron.Event, input: Electron.Input) => {
    if (input.type !== 'keyDown') return

    let { code, control: ctrlKey, shift: shiftKey, alt: altKey } = input

    if (code.startsWith('Key')) {
      code = code.slice('Key'.length)
    } else if (code.startsWith('Digit')) {
      code = code.slice('Digit'.length)
    }

    if (shiftKey && altKey) code = `Shift + Alt + ${code}`
    else if (ctrlKey && shiftKey) code = `Ctrl + Shift + ${code}`
    else if (ctrlKey && altKey) code = `Ctrl + Alt + ${code}`
    else if (altKey) code = `Alt + ${code}`
    else if (ctrlKey) code = `Ctrl + ${code}`
    else if (shiftKey) code = `Shift + ${code}`

    switch (code) {
      case 'Escape':
      case 'Ctrl + W': {
        event.preventDefault()
        process.nextTick(this.assertGameActive)
        break
      }
      case this.overlayKey: {
        event.preventDefault()
        process.nextTick(this.toggleActiveState)
        break
      }
    }
  }

  private handleOverlayAttached = (hasAccess?: boolean) => {
    if (hasAccess === false) {
      this.logger.write('error [Overlay] PoE is running with administrator rights')

      dialog.showErrorBox(
        'PoE window - No access',
        // ----------------------
        'Path of Exile is running with administrator rights.\n' +
        '\n' +
        'You need to restart Awakened PoE Trade with administrator rights.'
      )
    } else {
      this.server.sendEventTo('broadcast', {
        name: 'MAIN->OVERLAY::overlay-attached',
        payload: undefined
      })
    }
  }

  private handlePoeWindowActiveChange = (isActive: boolean) => {
    if (isActive && this.isInteractable) {
      this.isInteractable = false
    }
    this.server.sendEventTo('broadcast', {
      name: 'MAIN->OVERLAY::focus-change',
      payload: {
        game: isActive,
        overlay: this.isInteractable,
        usingHotkey: this.isOverlayKeyUsed
      }
    })
    this.isOverlayKeyUsed = false
  }
}
