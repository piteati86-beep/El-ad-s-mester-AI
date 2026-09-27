# ElőadásMester AI v7

Deploymentre előkészített, Node.js + Express alapú AI jegyzetelő.

## Mit tud?
- hangfájl feltöltése és magyar nyelvű átirata
- előadás leiratából AI-jegyzet készítése
- összefoglaló, jegyzetpontok, vázlat
- kulcsfogalmak és vizsgapontok
- ellenőrző kérdések és válaszok
- iPhone-ról is használható reszponzív felület

## Helyi indítás
1. `npm install`
2. `.env.example` alapján állítsd be az `OPENAI_API_KEY` környezeti változót.
3. `npm start`

## Render telepítés
A projekt Render Web Service-ként telepíthető.
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variable: `OPENAI_API_KEY` = a saját OpenAI API-kulcsod
- Health check: `/health`

A `render.yaml` tartalmazza ezeket a beállításokat.

## Fontos
Az OpenAI API-kulcsot ne tedd a GitHub repóba és ne írd bele a frontend kódjába. A kulcsot a szerver oldali környezeti változóban kell megadni.
