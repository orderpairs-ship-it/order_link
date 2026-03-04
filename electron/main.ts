/**
 * Order Link - Electron Main Process
 * 
 * This is the main entry point for the Electron application.
 * It creates the browser window and handles app lifecycle events.
 */

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';

// Auto-updater (optional - for future implementation)
// import { autoUpdater } from 'electron-updater';

let mainWindow: BrowserWindow | null = null;

// Application metadata
const isDev = process.env.NODE_ENV === 'development';
const appName = 'Order Link';
const appVersion = app.getVersion();

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: appName,
    show: false, // Don't show until ready
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
    },
  });

  // Load the app
  if (isDev) {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load built files
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * App lifecycle events
 */

// App ready
app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Initialize auto-updater (optional - for future implementation)
  // initAutoUpdater();
});

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:5173' && !parsedUrl.origin.startsWith('file://')) {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

/**
 * IPC Handlers
 */

// App version
ipcMain.handle('app:getVersion', () => {
  return appVersion;
});

// App info
ipcMain.handle('app:getInfo', () => {
  return {
    name: appName,
    version: appVersion,
    platform: process.platform,
    arch: process.arch,
  };
});

// File dialog (for importing/exporting data)
ipcMain.handle('dialog:openFile', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow!, options);
  return result;
});

ipcMain.handle('dialog:saveFile', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow!, options);
  return result;
});

/**
 * Auto-updater initialization (optional - for future implementation)
 */
function initAutoUpdater(): void {
  // autoUpdater.autoDownload = false;
  // autoUpdater.autoInstallOnAppQuit = true;

  // autoUpdater.on('checking-for-update', () => {
  //   console.log('Checking for updates...');
  // });

  // autoUpdater.on('update-available', (info) => {
  //   console.log('Update available:', info);
  //   // Notify renderer process
  //   mainWindow?.webContents.send('update-available', info);
  // });

  // autoUpdater.on('update-not-available', (info) => {
  //   console.log('Update not available:', info);
  // });

  // autoUpdater.on('error', (err) => {
  //   console.error('Update error:', err);
  // });

  // autoUpdater.on('download-progress', (progress) => {
  //   console.log('Download progress:', progress);
  // });

  // autoUpdater.on('update-downloaded', (info) => {
  //   console.log('Update downloaded:', info);
  //   mainWindow?.webContents.send('update-downloaded', info);
  // });

  // Check for updates on startup
  // autoUpdater.checkForUpdates();
}

/**
 * Export for use in other modules
 */
export { mainWindow, isDev, appName, appVersion };
