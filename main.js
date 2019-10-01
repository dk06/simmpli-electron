const {app,  BrowserWindow, shell, ipcMain , dialog , Menu,  Tray} = require("electron");
const electron = require('electron')
const path = require("path");
const url = require("url");

const { protocol } = require('electron');
const nfs = require('fs');
const npjoin = require('path').join;
const es6Path = npjoin(__dirname, 'www');

let win, serve, isQuiting;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

console.log('serve', serve)

const nativeImage = electron.nativeImage;
let icon = nativeImage.createFromPath(path.join(__dirname, 'dist', 'assets', 'image', 'simmpli-64x64.png'));
let trayIcon = nativeImage.createFromPath(path.join(__dirname, 'dist', 'assets', 'image', 'tray.png'));


protocol.registerSchemesAsPrivileged([{ scheme: 'es6', privileges: { standard: true, secure: true } }])


function createWindow() {

  appIcon = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
      { label: 'Show App', click:  function(){
          win.show();
      } },
      { label: 'Quit', click:  function(){
          app.isQuiting = true;
          app.quit();
      } }
 ]);

  // app.setBadgeCount(6);
  // appIcon.setToolTip('This is my application.')
  appIcon.setContextMenu(contextMenu)

  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: width,
    height: height,
    icon: icon,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    // win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('close', (event) => {
    if (app.isQuiting) {
      console.log('app close');

      win = null
      app.quit();
    } else {
      console.log('app working background');

      event.preventDefault()
      win.hide()
    }
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async()=>{
    protocol.registerBufferProtocol('es6', (req, cb) => {
      nfs.readFile(
        npjoin(es6Path, req.url.replace('es6://', '')),
        (e, b) => { cb({ mimeType: 'text/javascript', data: b }) }
      )
    })

    await createWindow();
  });

  app.on('before-quit', function () {
    app.isQuiting = true;
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
