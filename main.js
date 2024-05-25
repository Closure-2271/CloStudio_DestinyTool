import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from './Server/Locol/LocolServer.js';
import { getWindowSize } from './Desktop/Display.js';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

// 忽略自签名证书
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});
startServer();

function createWindow() {
    const windowSize = getWindowSize();

    const mainWindow = new BrowserWindow({
        width: windowSize.width || 800,
        height: windowSize.height || 1000,

        resizable: true,
        fullscreen: false,
        icon: path.join(__dirname, '可露希尔小奖章.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true // 允许使用 webview 标签
        }
    });

    mainWindow.loadFile('Web/index.html');
}

app.on('ready', () => {
    createWindow();
});

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
