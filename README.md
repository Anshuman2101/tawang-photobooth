# Setup, Run, Debug & Deploy — Tawang Photobooth (v2 — React)

This is the **one file** you need to get this project running on your own computer, debug it, and put it online. No coding experience assumed beyond following steps in order.

> New to the project? Read [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) first (what this is / how it looks), then [TECH_STACK_AND_FLOWS.md](TECH_STACK_AND_FLOWS.md) (what technology is used and why).

> **v2 note:** this project was migrated from plain HTML/CSS/JS to **React + Vite**. That means, unlike the previous version, you now need **Node.js** installed to run or build it — there's no way around that with React. The steps below cover installing it.

---

## 1. What you need installed

| Tool | Why | Get it |
|---|---|---|
| **Node.js** (version 18 or newer) | Runs the local dev server and the build tool (Vite) | [nodejs.org](https://nodejs.org/) — download the "LTS" installer and run it (Next → Next → Finish, default options are fine) |
| **Git** (only needed for deploying) | Sends your code to GitHub | [git-scm.com](https://git-scm.com/) — or use GitHub Desktop as a graphical alternative |

To check if Node is already installed, open a terminal and run:

```powershell
node --version
npm --version
```

If you see version numbers (e.g. `v20.11.0`), you're set. If you see an error, install Node.js from the link above, then re-open your terminal.

---

## 2. Running the project locally

1. Open this project folder in VS Code (or Cursor / Antigravity).
2. Open a terminal in the project folder (VS Code: **Terminal → New Terminal**).
3. Install dependencies **once**:

   ```powershell
   npm install
   ```

4. Start the local dev server:

   ```powershell
   npm run dev
   ```

5. Terminal will print a local address, e.g. `http://localhost:5173/` — open that in your browser. The page automatically reloads whenever you save a file.

Camera access requires a secure context (`https://` or `localhost`) — `http://localhost:5173` counts as secure, so the camera will work fine here on your own computer.

### Testing the camera on your phone

1. Stop the dev server (`Ctrl+C` in the terminal) and restart it exposed to your network:

   ```powershell
   npm run dev -- --host
   ```

2. It will print a "Network" address like `http://192.168.1.23:5173/`. Make sure your phone is on the **same Wi-Fi** as your computer, then open that address on your phone.
3. Some phone browsers still block camera access on a plain local IP over `http://`. If that happens, use a free tunnelling tool such as [ngrok](https://ngrok.com/) (`ngrok http 5173`) to get a temporary `https://` link, or just test on GitHub Pages once deployed (Section 4).

---

## 3. Debugging

- **Browser DevTools console** is your main tool. On desktop Chrome/Edge: press `F12` → **Console** tab. Any JavaScript/React errors show up there in red, usually with the exact file and line.
- **Camera doesn't turn on:**
  - Check the address bar shows `https://` or `localhost` — camera access is blocked otherwise.
  - Check the browser didn't block the permission prompt (look for a small camera icon in the address bar; click it to change to "Allow").
  - Make sure no other app/tab is already using the camera.
- **A frame or image doesn't show up:** open DevTools → **Network** tab, reload, and look for any request shown in red (404) — that tells you the exact file path that's missing (check `public/assets/...`).
- **The whole page is blank:** check the Console tab first — a React error early in `src/main.jsx` will stop the whole app from starting. The dev server's terminal output also shows build errors directly.
- **Something looks broken after editing a component:** Vite's fast-refresh usually catches this instantly in the browser; if not, do a hard refresh (`Ctrl+Shift+R`).

---

## 4. Deploying for free with GitHub Pages

GitHub Pages hosts static files for free and automatically serves them over HTTPS — exactly what's needed for the camera to work on visitors' phones. Because this is now a React app, it needs to be **built** first (`npm run build` turns the source code into a small `dist/` folder of plain HTML/CSS/JS) — a GitHub Actions workflow (already included in this project at `.github/workflows/deploy.yml`) does that automatically every time you push.

### 4.1 Create the GitHub repository

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **New repository** (top-right `+` icon). Give it a name, e.g. `tawang-photobooth`. Keep it **Public**. Do not add a README (this project already has one).
3. Click **Create repository**.

### 4.2 Push this project to GitHub

Open a terminal in this project folder and run (replace the URL with your own repository's URL, shown on the GitHub page after creating it):

```powershell
git init
git add .
git commit -m "Initial commit: Tawang Photobooth (React)"
git branch -M main
git remote add origin https://github.com/<your-username>/tawang-photobooth.git
git push -u origin main
```

### 4.3 Turn on GitHub Pages (one-time setup)

1. On your repository's GitHub page, go to **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not "Deploy from a branch" — this project's included workflow handles the build itself).
3. Push to `main` (or re-run the workflow from the **Actions** tab) — after a minute or two, the **Actions** tab will show a green checkmark, and **Settings → Pages** will show your live URL:

   `https://<your-username>.github.io/tawang-photobooth/`

That link is your permanent, HTTPS, free-hosting URL. It's what your QR code at the exhibition should point to.

### 4.4 Updating the site later

Any time you change files, just repeat:

```powershell
git add .
git commit -m "Describe what changed"
git push
```

The GitHub Actions workflow automatically rebuilds and redeploys within a minute or two of every push — no need to run `npm run build` yourself before pushing.

### 4.5 (Alternative) Manual deploy without GitHub Actions

If you'd rather build and publish by hand:

```powershell
npm run build
npx gh-pages -d dist
```

This pushes the contents of `dist/` to a `gh-pages` branch directly. If you use this method, set **Settings → Pages → Source** to **Deploy from a branch → `gh-pages`** instead of GitHub Actions.

---

## 5. Generating the exhibition QR code

Once you have the GitHub Pages URL, use any free QR code generator (for example [qr-code-generator.com](https://www.qr-code-generator.com/) or [qrcode-monkey.com](https://www.qrcode-monkey.com/)) and paste in your `https://<your-username>.github.io/tawang-photobooth/` link. Print/display that QR code at the installation.

---

## 6. Project structure reference

```
index.html                  Vite entry point
vite.config.js               Vite config
package.json                  npm scripts: dev / build / preview
.github/workflows/deploy.yml   Auto-builds and deploys to GitHub Pages on every push to main
public/assets/                Frame images, welcome artwork, camera graphic (served as-is)
src/
  main.jsx                    App entry point
  App.jsx                      Screen router + session provider
  state/SessionContext.jsx      Shared session state (photo count, frame, filter, photos)
  hooks/useCamera.js             Camera start/stop/readiness
  utils/                          capturePhoto.js, composeFinalImage.js, publicAsset.js
  data/frames.js                   Frame asset paths + photo-slot positions
  components/                       Button, ScreenShell (shared UI pieces)
  screens/                           WelcomeScreen, OptionsScreen, CameraScreen, FinalScreen
  styles/global.css                  Design tokens (colors, fonts), resets
SYSTEM_DESIGN.md              Overview + appearance design
TECH_STACK_AND_FLOWS.md        Tech stack + how the app works
README.md                      This file
```

