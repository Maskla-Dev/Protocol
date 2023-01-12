import { app, BrowserWindow } from "electron";
import path from "path";

app.on('ready', () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    window.loadFile(path.join(__dirname, "renderer", "index.html"));
    window.webContents.openDevTools();
});