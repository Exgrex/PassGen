# 🔐 PassGen

**Desktop password generator focused on security, privacy, and local processing.**

**PassGen** is a desktop application built with Electron for generating strong passwords in a simple and customizable way.

In addition to random password generation, the application can create variations from a word or base password and find references related to topics of interest to use as a starting point.

The project's goal is to keep password generation and transformation on the user's device, using external services only when needed for topic-based references.

---

## ✨ Features

### 🎲 Password Generation

- Passwords from **5 to 24 characters**
- Lowercase letters
- Uppercase letters
- Numbers
- Symbols
- Selectable character types
- Password strength indicator
- Generation using `crypto.getRandomValues()`
- Copy password button
- Quick new-password generation

### 🔄 Password and Word Variations

You can provide a word or base password to generate different variations.

Transformations include:

- Uppercase and lowercase variations
- **Leet speak** substitutions
- Numbers
- Symbols
- Different character combinations

Exemplo:

```text
Base:
Dragon

Possíveis variações:
Dr4g0n!
DRAGON#24
dr4g0n$
DraG0n@7
```

> Variations are processed locally by the application.

### 💡 Topic-Based References

Users can enter a topic, name, or interest and receive related words that can be used as a basis for generating variations.

Exemplo:

```text
Tema:
Space

Referências:
Galaxy
Nebula
Apollo
Saturn
Cosmos
```

The feature has multiple reference sources and uses the following fallback order:

1. Claude/Artifact, when available
2. Wikipedia
3. Datamuse
4. Anthropic API, if a personal API key is configured
5. Built-in local topic database when no connection is available

### 🌙 Dark Mode

PassGen supports both light and dark modes.

The selected preference is saved locally and restored on the next launch.

### 📋 Copy Password

Generated passwords can be copied directly from the interface for easy use in other applications and services.

---

# 🛠️ Technologies

The project uses:

- **Electron** — desktop application
- **JavaScript** — application logic
- **HTML5** — interface structure
- **CSS3** — styling
- **Node.js / npm** — project and dependency management
- **Run Electron Builder** — application packaging
- **Web Crypto API** — cryptographically secure random number generation
- **LocalStorage** — local preference storage and, optionally, Anthropic API key storage
- **Wikipedia API** — topic references
- **Datamuse API** — related-word references
- **Anthropic API** — advanced references using a user-provided API key

---

# 📋 Requirements

To run the project from source, you need:

### Node.js

Using **Node.js 20** is recommended, and it is also the version used by the project's automated build workflow.

The project uses:

- Electron `^31.0.0`
- Run Electron Builder `^24.13.3`

Check your installation:

```bash
node --version
npm --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/Exgrex/PassGen.git
```

Enter the project directory:

```bash
cd PassGen
```

Install the dependencies:

```bash
npm install
```

---

# ▶️ Running the Application

To start PassGen in development mode:

```bash
npm start
```

This command runs:

```bash
electron .
```

The application will open in its own desktop window.

---

# 📦 Building the Installer

The project uses **Run Electron Builder** to generate distributable builds.

Run:

```bash
npm run build
```

O comando executa:

```bash
electron-builder
```

Distribution files are generated in:

```text
dist/
```

## Supported Platforms

A configuração do Run Electron Builder possui alvos para:

| Platform | Format |
|---|---|
| Windows | `.exe` / NSIS |
| macOS | `.dmg` |
| Linux | `.AppImage` |

To specifically build the Windows version:

```bash
npm run build -- --win --publish=never
```

---

# 📁 Project Structure

The main project structure is:

```text
PassGen/
│
├── app/
│   └── index.html
│
├── main.js
├── index.html
├── package.json
├── build.yml
└── README.md
```

### `app/index.html`

This is the main application interface file.

It contains:

- Interface HTML
- CSS
- Application JavaScript
- Password generator
- Strength indicator
- Dark mode
- Variation system
- Topic-based references
- API integrations

### `main.js`

This is the Electron main process.

It is responsible for:

- Creating the application window
- Defining initial and minimum window sizes
- Loading `app/index.html`
- Configuring the Electron security environment
- Disabling hardware acceleration to work around white-screen issues on some machines
- Opening DevTools with `F12` or `Ctrl + Shift + I`
- Handling loading failures
- Managing the application lifecycle

The window is created with:

```text
Initial width: 620px
Initial height: 840px

Minimum width: 380px
Minimum height: 600px
```

### `index.html`

Contains a copy/version of the HTML interface in the project root.

The desktop application currently loaded by Electron uses:

```text
app/index.html
```

### `package.json`

It contains:

- Project metadata
- Scripts
- Dependencies
- Run Electron Builder configuration
- Installer configuration for Windows, macOS, and Linux

Main scripts:

```bash
npm start
npm run build
```

### `build.yml`

Configuration file used for the automated build process.

The workflow uses a Windows runner, installs Node.js 20, installs dependencies, and generates the `.exe` installer.

---

# 🧠 How the Generator Works

PassGen uses separate character sets:

```text
Minúsculas:
abcdefghijklmnopqrstuvwxyz

Maiúsculas:
ABCDEFGHIJKLMNOPQRSTUVWXYZ

Números:
0123456789

Símbolos:
!@#$%^&*()-_=+[]{}?
```

Users can choose which character sets to use and define the password length.

The application ensures that at least one character from each selected category is included.

The remaining characters are then selected randomly and the password is shuffled using Fisher-Yates.

---

# 🔐 Random Generation

PassGen uses the following to obtain random values:

```javascript
crypto.getRandomValues()
```

Instead of relying on `Math.random()`, the application uses the Web Crypto API available in the browser/Electron environment.

The goal is to provide a suitable source of randomness for password generation.

---

# 📊 Strength Indicator

The application estimates password strength based on password length and the detected character set.

The displayed categories are:

```text
Very weak
Weak
Good
Very strong
```

The estimate uses an entropy approximation:

```text
entropia ≈ tamanho × log2(tamanho do conjunto de caracteres)
```

> The indicator is an estimate intended to guide the user. It does not replace a complete security audit or compromised-password analysis.

---

# 🌐 Topic-Based References

The topic-based reference feature is designed to work with multiple sources.

## 1. Claude / Artifact

When the application is running in an environment compatible with `claude.use('sample')`, PassGen can request topic-related words from Claude.

## 2. Wikipedia

When the previous option is unavailable, the application queries Wikipedia for a related article and uses categories and links from that article as a source of related words.

## 3. Datamuse

If Wikipedia returns no results, the application queries the Datamuse API for semantically related words.

## 4. Anthropic API

Users can provide their own Anthropic API key in **Advanced Options**.

The key is stored in the device's `localStorage` and sent directly to the Anthropic API when this option is used.

> Using the Anthropic API may incur charges on the user's account according to Anthropic's terms.

## 5. Local Fallback

If external sources are unavailable, PassGen has a built-in database of popular topics.

This allows some topics to continue working even without an internet connection.

---

# 🔒 Privacy

PassGen is designed to keep password generation and transformation local.

### Processed Locally

- Random password generation
- Word variations
- Leet speak substitutions
- Uppercase/lowercase transformations
- Strength indicator
- Dark mode
- Local preferences

### May Use External Connections

The topic-based reference feature may access:

- Claude/Artifact
- Wikipedia
- Datamuse
- Anthropic API

The **searched topic** may be sent to the external service being used.

### ⚠️ Important

**Never enter a real password as a topic or search term.**

The topic-based reference feature should be used for subjects, interests, or generic words—not to submit existing passwords.

---

# 🔑 Anthropic API Key

The optional Anthropic integration can provide references for more specific topics.

The key can be added under:

```text
Topic-Based References
└── Advanced Options
```

It is stored locally using:

```javascript
localStorage
```

The key is not sent to the PassGen developer; when used, the request is made directly to the Anthropic API.

> However, storing an API key in local storage within a desktop application has risks. Use this feature only if you understand those risks and the API's terms of use.

---

# 🖥️ Electron Configuration

The application uses several settings to improve window compatibility and security.

```javascript
contextIsolation: true
nodeIntegration: false
```

These settings prevent Node.js APIs from being directly exposed to the interface content.

The application also disables hardware acceleration:

```javascript
app.disableHardwareAcceleration();
```

This was included to prevent white-screen issues related to GPU acceleration on some machines.

---

# 🐛 Development and Debugging

During development, DevTools can be opened using:

```text
F12
```

or:

```text
Ctrl + Shift + I
```

This allows you to inspect:

- JavaScript errors
- Loading errors
- Network requests
- Console
- Interface elements

The Electron main process also logs loading failures to the console.

---

# 🤖 Automated Build

The project includes a Windows build configuration using GitHub Actions.

The workflow performs:

```text
Checkout the code
        ↓
Install Node.js 20
        ↓
npm install
        ↓
Run Electron Builder
        ↓
Generate the Windows installer (.exe)
        ↓
Upload the artifact
```

O instalador pode ser disponibilizado como um artefato do GitHub Actions.

> To use GitHub Actions, the workflow file must be located inside `.github/workflows/`.

---

# 📌 Project Status

**Current version: 1.0.0**

### Implemented

- [x] Geração de senhas aleatórias
- [x] Comprimento de 5 a 24 caracteres
- [x] Letras maiúsculas
- [x] Letras minúsculas
- [x] Números
- [x] Símbolos
- [x] Indicador de força
- [x] Copiar senha
- [x] Variação de palavras
- [x] Leet speak
- [x] Topic-Based References
- [x] Fallback para Wikipedia
- [x] Fallback para Datamuse
- [x] Fallback para base local
- [x] Integração opcional com Anthropic
- [x] Modo escuro
- [x] Persistência da preferência de tema
- [x] Build para Windows
- [x] Configuração de build para macOS
- [x] Configuração de build para Linux

### Possible Improvements

- [ ] Add automated tests
- [ ] Improve password strength analysis
- [ ] Add more generation options
- [ ] Add more variation methods
- [ ] Improve the interface
- [ ] Add official releases
- [ ] Add a custom application icon
- [ ] Improve the update system
- [ ] Add contribution documentation

---

# 🚀 Roadmap

### Security

- Continuously review the random generation system
- Improve strength analysis
- Evaluate safer options for API key storage

### Interface

- Improve visual feedback
- Add new customization options
- Improve accessibility

### Integrations

- Add new reference providers
- Allow users to choose the reference source
- Improve connection error handling

### Distribution

- Publish Windows releases
- Publish Linux releases
- Publish macOS releases

---

# 📄 License

This project is licensed under the **MIT** License.

See the repository license file for the complete terms.

---

# 👨‍💻 Author

Developed by **Exgrex**.

GitHub:

https://github.com/Exgrex

Repository:

https://github.com/Exgrex/PassGen
