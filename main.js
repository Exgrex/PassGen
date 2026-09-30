const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Corrige tela branca causada por problemas de aceleração de GPU em algumas
// máquinas Windows (bug comum do Electron/Chromium).
app.disableHardwareAcceleration();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

// Serve a pasta app/ por http://127.0.0.1 em vez de abrir como file://.
// Necessário pro widget do Google Tradutor: ele busca o conteúdo traduzido
// através de um iframe interno, e isso é bloqueado silenciosamente quando a
// página está em file:// — o Google "confirma" a troca, mas o texto nunca
// chega a mudar de verdade. Com http://, esse mecanismo funciona normalmente.
function startLocalServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const safePath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(rootDir, safePath === '/' ? 'index.html' : safePath);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 620,
    height: 840,
    minWidth: 380,
    minHeight: 600,
    title: 'PassGen',
    backgroundColor: '#eef6fc',
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);

  // Só mostra a janela quando o conteúdo já estiver pronto, evitando
  // qualquer tela em branco durante o carregamento.
  win.once('ready-to-show', () => {
    win.show();
  });

  // Se o carregamento falhar por qualquer motivo, mostra o erro no console
  // (abra com Ctrl+Shift+I) em vez de deixar a janela em branco sem explicação.
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Falha ao carregar o app:', errorCode, errorDescription);
  });

  // Atalho para abrir o DevTools e ver erros, mesmo com o menu escondido.
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toUpperCase() === 'I')) {
      win.webContents.toggleDevTools();
    }
  });

  try {
    const server = await startLocalServer(path.join(__dirname, 'app'));
    const { port } = server.address();
    win.on('closed', () => server.close());
    win.loadURL(`http://127.0.0.1:${port}/index.html`);
  } catch (e) {
    // se o servidor local não subir por algum motivo, cai pro file:// mesmo
    // (a tradução real não vai funcionar nesse caso, mas o resto do app sim)
    win.loadFile(path.join(__dirname, 'app', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
