# PassGen

**Desktop password generator focused on security, privacy, and local processing.**

PassGen is a desktop application built with Electron for generating strong passwords in a simple and customizable way.

In addition to random password generation, the application can create variations from a word or base password and find references related to topics of interest to use as a starting point.

The project's goal is to keep password generation and transformation on the user's device, using external services only when needed for topic-based references.

---

## Features

### Password Generation

- Passwords from **5 to 24 characters**
- Lowercase letters
- Uppercase letters
- Numbers
- Symbols
- Selectable character types
- Password strength indicator
- Random generation using `crypto.getRandomValues()`
- Copy password button
- Quick new-password generation

### Password Variations

Provide a word or base password to generate different variations.

Transformations include:

- Uppercase and lowercase variations
- **Leet speak** substitutions
- Numbers
- Symbols
- Different character combinations

Example:

```text
Base:
Dragon

Possible variations:
Dr4g0n!
DRAGON#24
dr4g0n$
DraG0n@7
```

Variations are processed locally by the application.

### Topic-Based References

Enter a topic, name, or interest to receive related words that can be used as a basis for generating password variations.

Example:

```text
Topic:
Space

References:
Galaxy
Nebula
Apollo
Saturn
Cosmos
```

The feature uses multiple reference sources with a fallback system:

1. Claude/Artifact, when available
2. Wikipedia
3. Datamuse
4. Anthropic API, if a personal API key is configured
5. Built-in local topic database

### Dark Mode

PassGen supports both light and dark modes.

The selected preference is saved locally and restored on the next launch.

### Copy Password

Generated passwords can be copied directly from the interface.

---

# Technologies

The project uses:

- **Electron** — desktop application
- **JavaScript** — application logic
- **HTML5** — interface structure
- **CSS3** — styling
- **Node.js / npm** — project and dependency management
- **Electron Builder** — application packaging
- **Web Crypto API** — cryptographically secure random number generation
- **LocalStorage** — local preference storage and optional Anthropic API key storage
- **Wikipedia API** — topic references
- **Datamuse API** — related-word references
- **Anthropic API** — advanced topic references using a user-provided API key

---

# Requirements

To run PassGen from source, you need:

### Node.js

**Node.js 20** is recommended and is also the version used by the automated build workflow.

Check your installation:

```bash
node --version
npm --version
```

If these commands are not recognized, install Node.js before continuing.

---

# Installation

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

# Running the Application

Start PassGen in development mode:

```bash
npm start
```

This runs:

```bash
electron .
```

The application will open in its own desktop window.

---

# Building the Installer

PassGen uses **Electron Builder** to generate distributable builds.

Run:

```bash
npm run build
```

Distribution files are generated in:

```text
dist/
```

## Supported Platforms

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

# Project Structure

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

Main application interface.

It contains:

- HTML interface
- CSS
- Application JavaScript
- Password generator
- Strength indicator
- Dark mode
- Password variation system
- Topic-based references
- API integrations

### `main.js`

The main Electron process.

It is responsible for:

- Creating the application window
- Defining initial and minimum window sizes
- Loading `app/index.html`
- Configuring Electron security settings
- Disabling hardware acceleration to work around white-screen issues on some machines
- Opening DevTools with `F12` or `Ctrl + Shift + I`
- Handling loading failures
- Managing the application lifecycle

Window configuration:

```text
Initial width: 620px
Initial height: 840px

Minimum width: 380px
Minimum height: 600px
```

### `index.html`

Contains an HTML version of the interface in the project root.

The Electron application currently loads:

```text
app/index.html
```

### `package.json`

Node.js project configuration file containing:

- Project metadata
- Scripts
- Dependencies
- Electron Builder configuration
- Windows, macOS, and Linux packaging settings

Main scripts:

```bash
npm start
npm run build
```

### `build.yml`

Configuration used by the automated build process.

The workflow uses a Windows runner, installs Node.js 20, installs dependencies, and generates the Windows `.exe` installer.

---

# 🧠 How the Generator Works

PassGen uses separate character sets:

```text
Lowercase:
abcdefghijklmnopqrstuvwxyz

Uppercase:
ABCDEFGHIJKLMNOPQRSTUVWXYZ

Numbers:
0123456789

Symbols:
!@#$%^&*()-_=+[]{}?
```

Users can choose which character sets to use and define the password length.

The application ensures that at least one character from each selected category is included.

The remaining characters are selected randomly, and the final password is shuffled using the Fisher-Yates algorithm.

---

# Random Generation

PassGen uses:

```javascript
crypto.getRandomValues()
```

Instead of relying on `Math.random()`, the application uses the Web Crypto API available in the browser/Electron environment.

This provides a more appropriate source of randomness for password generation.

---

# Password Strength Indicator

The application estimates password strength based on the password length and the detected character set.

The displayed categories are:

```text
Very weak
Weak
Good
Very strong
```

The estimate uses an entropy approximation:

```text
entropy ≈ password length × log2(character set size)
```

> The indicator is an estimate intended to guide the user. It does not replace a complete security audit or compromised-password analysis.

---

# Topic-Based References

The topic-reference feature is designed to work with multiple sources.

## 1. Claude / Artifact

When the application is running in an environment compatible with `claude.use('sample')`, PassGen can request topic-related words from Claude.

## 2. Wikipedia

If the previous option is unavailable, the application queries Wikipedia for a related article and uses categories and links from that article as sources of related words.

## 3. Datamuse

If Wikipedia returns no results, PassGen queries the Datamuse API for semantically related words.

## 4. Anthropic API

Users can provide their own Anthropic API key through **Advanced Options**.

The key is stored in the device's `localStorage` and sent directly to the Anthropic API when this option is used.

> Using the Anthropic API may incur charges on the user's account according to Anthropic's terms.

## 5. Local Fallback

If external sources are unavailable, PassGen has a built-in database of popular topics.

This allows some topics to continue working without an internet connection.

---

# Privacy

PassGen is designed to keep password generation and transformation local whenever possible.

### Processed Locally

- Random password generation
- Word variations
- Leet speak substitutions
- Uppercase/lowercase transformations
- Password strength estimation
- Dark mode
- Local preferences

### External Connections

The topic-based reference feature may access:

- Claude/Artifact
- Wikipedia
- Datamuse
- Anthropic API

The **searched topic** may be sent to the external service being used.

### Important

**Never enter a real password as a topic or search term.**

The topic-reference feature should only be used with subjects, interests, or generic words—not existing passwords.

---

# Anthropic API Key

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

The key is not sent to the PassGen developer. When used, requests are sent directly to the Anthropic API.

> Storing an API key in local storage within a desktop application has risks. Use this feature only if you understand those risks and the API's terms of use.

---

# Electron Configuration

PassGen uses Electron security settings including:

```javascript
contextIsolation: true
nodeIntegration: false
```

These settings prevent Node.js APIs from being directly exposed to the application's interface.

The application also disables hardware acceleration:

```javascript
app.disableHardwareAcceleration();
```

This was included to work around GPU-related white-screen issues on some machines.

---

# Development and Debugging

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
- Console output
- Interface elements

The Electron main process also logs loading failures to the console.

---

#  Automated Build

The project includes a Windows build workflow using GitHub Actions.

The workflow performs:

```text
Checkout the code
        ↓
Install Node.js 20
        ↓
Install dependencies
        ↓
Run Electron Builder
        ↓
Generate Windows installer (.exe)
        ↓
Upload the artifact
```

> For GitHub Actions to recognize a workflow automatically, the workflow file must be located inside `.github/workflows/`.

---

# Author

Developed by **Exgrex**.

GitHub:

https://github.com/Exgrex

Repository:

https://github.com/Exgrex/PassGen
