const { app, BrowserWindow } = require('electron');
const path = require('path');

// Corrige tela branca causada por problemas de aceleração de GPU em algumas
// máquinas Windows (bug comum do Electron/Chromium).
app.disableHardwareAcceleration();

function createWindow() {
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

  win.loadFile(path.join(__dirname, 'app', 'index.html'));
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
