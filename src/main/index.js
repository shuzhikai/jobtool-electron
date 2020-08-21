import { app, BrowserWindow, ipcMain, net  } from 'electron' // eslint-disable-line


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow
const winURL = process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {
    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    })
    mainWindow.maximize()
    mainWindow.loadURL(winURL)
    mainWindow.on("closed", () => {
        mainWindow = null
    })
    mainWindow.openDevTools();
    ipcMain.on("vue-fresh-content", (event, status) => {
        mainWindow.webContents.reload()
    })
    // setInterval(() => {
    //     mainWindow.webContents.reload()
    // }, 4000);
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
