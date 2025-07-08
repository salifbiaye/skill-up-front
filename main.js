const { app, BrowserWindow } = require('electron');
const next = require('next');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');

const dev = false; // Force production pour l'exe
const nextApp = next({ dev, dir: path.join(__dirname), hostname: '127.0.0.1', port: 0 });
const handle = nextApp.getRequestHandler();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'public', 'skillup-icon.ico'),
    title: 'SkillUp',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.webContents.openDevTools();

  nextApp.prepare().then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const internalUrl = `http://127.0.0.1:${address.port}`;
      process.env.NEXT_PUBLIC_ORIGIN = internalUrl;
      console.log(`> Next.js running internally at ${internalUrl}`);
      win.loadURL(internalUrl);
    });
  });

  // Synchronise la déconnexion Zustand à la fermeture de la fenêtre
  win.on('close', (e) => {
    // Empêche la fermeture immédiate
    e.preventDefault();
    // Envoie le signal de logout au renderer
    win.webContents.send('force-logout');
    // Donne un délai pour que le logout s’exécute côté client
    setTimeout(() => {
      win.destroy(); // ferme vraiment la fenêtre
    }, 300);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});