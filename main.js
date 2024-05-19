import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from './Server/Locol/LocolServer.js';
import { getWindowSize } from './Desktop/Display.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 忽略自签名证书
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});
startServer();

function createWindow() {
    // 获取动态窗口尺寸
    const windowSize = getWindowSize();

    const mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        minWidth: windowSize.minWidth,
        minHeight: windowSize.minHeight,
        resizable: true,
        fullscreen: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('Web/index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
