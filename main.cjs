const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#18181b', // Tailwind dark background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hiddenInset',
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  const prodPath = path.join(__dirname, 'dist', 'index.html');
  if (devUrl) {
    console.log('Loading DEV URL:', devUrl);
    win.loadURL(devUrl);
  } else {
    console.log('Loading PROD file:', prodPath);
    if (!fs.existsSync(prodPath)) {
      // Failsafe: create a minimal index.html if missing
      fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
      fs.writeFileSync(prodPath, '<!DOCTYPE html><html><body><h1>dist/index.html was missing. Please run npm run build.</h1></body></html>');
      dialog.showErrorBox('Missing dist/index.html', `dist/index.html was missing. A placeholder was created. Please run npm run build to generate the real app.`);
    }
    win.loadFile(prodPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
