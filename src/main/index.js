import { app, BrowserWindow, globalShortcut, Tray, Menu, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import windowDimens from 'common/windowDimens'
import endpoint from 'common/endpoint'
import path from 'path'

const firstInstance = app.requestSingleInstanceLock()
const inDev = process.env.NODE_ENV === 'development'
const icon = path.join(__static, 'icon.ico')
let mainWin, tray

function createMainWindow() {
  autoUpdater.checkForUpdatesAndNotify()
  const [width, height, x, y] = windowDimens()

  mainWin = new BrowserWindow({
    width,
    height,
    x,
    y,
    maximizable: false,
    movable: true,
    frame: false,
    icon
  })

  mainWin.loadURL(endpoint(inDev))

  inDev && setupDevtools()

  mainWin.setMenu(null)

  setupTray()

  mainWin.on('minimize', () => {
    mainWin.setSkipTaskbar(true)
  })

  mainWin.on('close', () => {
    mainWin = null
  })

  globalShortcut.register('CommandOrControl+D', () => sendToRenderer('dropper.open'))
}

function setupDevtools() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS
  } = require('electron-devtools-installer')
  mainWin.webContents.openDevTools({ mode: 'detach' })

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Installed -->  ${name}`))
    .catch(console.log)
}

function setupTray() {
  tray = new Tray(icon)
  tray.setToolTip('Color Tool')

  let contextMenu = Menu.buildFromTemplate([
    { label: 'Color Tool', click: () => sendToRenderer('picker.large') },
    { label: 'Project Mode', click: () => sendToRenderer('picker.small') },
    { label: 'Dropper', click: () => sendToRenderer('dropper.open') },
    { label: 'Documentation', click: () => openDocumentation() },
    { role: 'Quit' }
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', () => onTrayClick())
}

function onTrayClick() {
  if (mainWin.isMinimized()) {
    mainWin.restore()
    mainWin.focus()
    sendToRenderer('picker.restore')
  } else {
    mainWin.focus()
    sendToRenderer('picker.focus')
  }
}

function sendToRenderer(msg) {
  console.log(`Main --> Renderer: [${msg}]`)
  mainWin.webContents.send(msg)
}

function openDocumentation() {
  shell.openExternal('https://github.com/benjaminadk/color-tool-remix')
}

if (!firstInstance) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWin) {
      if (mainWin.isMinimized()) {
        mainWin.restore()
        mainWin.focus()
        sendToRenderer('picker.restore')
      }
    }
  })
  app.on('ready', createMainWindow)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
