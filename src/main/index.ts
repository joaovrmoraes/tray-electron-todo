import { app, BrowserWindow, ipcMain, Tray, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true, // Adicione esta linha
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const ret = globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  if (!ret) {
    console.log('registro de atalho global falhou')
  }

  // Verifique se o atalho está registrado.
  globalShortcut.isRegistered('CommandOrControl+Shift+T')

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  tray = new Tray(icon)

  tray!.on('click', () => {
    if (!mainWindow) {
      createWindow()
    }

    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        const { x, y } = tray!.getBounds()
        const { width, height } = mainWindow.getBounds()
        const adjustedX = x - width / 2
        const adjustedY = y - height
        mainWindow.setPosition(adjustedX, adjustedY)
        mainWindow.show()
      }
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  // Desregistra todos os atalhos.
  globalShortcut.unregisterAll()
})
