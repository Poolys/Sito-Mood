# Sito-Mood
Sito Premium Pooly's Mood - Espositori Lusso per Vino


Questo repository contiene il codice del nuovo sito, pensato per cantine, enoteche e hospitality di lusso.

**Live:** [sito-mood.vercel.app](https://sito-mood.vercel.app)

## Pagine

- Home — hero, collezione, atelier, progetti
- Catalogo — filtri per categoria e schede prodotto
- Atelier — lavorazioni e materiali
- Progetti — pezzi unici
- Personalizza — configuratore richiesta
- Contatto — form di richiesta
- Licensing / Termini

Lingue: **Italiano** e **English**.

## Stack

- React 19 + TanStack Start / Router
- Tailwind CSS v4
- Vite 8
- Better Auth (autenticazione)
- Kysely ORM + PGLite/PostgreSQL
- Radix UI (componenti accessibili)
- Vercel (deploy)

## Avvio in locale

```bash
npm install
npm run dev
```

L'app è accessibile su `http://0.0.0.0:8080` (live preview supporta questo binding).

Build di produzione:

```bash
npm run build
npm run preview:restart
```

## Contenuti

Catalogo, testi e immagini sono in:

- `src/lib/catalog.ts` — prodotti e categorie
- `src/lib/i18n.ts` — testi IT/EN
- `public/products`, `public/mood`, `public/progetti` — immagini

## Architettura

### `/src/lib`
- **`catalog.ts`** — Definizione prodotti con metadata (featured, slug, immagini)
- **`i18n.ts`** — Traduzioni centralizzate (IT/EN)
- **`store.ts`** — Zustand store (lingua, idratazione)
- **`auth/`** — Better Auth setup e provider
- **`db.ts`** — Connexione Kysely a PGLite/Postgres
- **`error-component.tsx`** — Error boundary con tema luxury

### `/src/routes`
- **`__root.tsx`** — Shell HTML, provider globali
- **`index.tsx`** — Home page
- **`catalogo.tsx`, `catalogo.$slug.tsx`** — Catalog e product detail
- **`atelier.tsx`**, **`progetti.tsx`** — Pagine statiche
- **`contatto.tsx`** — Contact form
- **`api/`** — Server functions e endpoints
  - **`pooly-chat.ts`** — Chat AI backend (integra xAI)
  - **`pooly-save.ts`** — Salva history chat su DB

### `/src/components`
- **`site-header.tsx`** — Navbar con nav link e language toggle
- **`site-footer.tsx`** — Footer
- **`pooly-ai.tsx`** — Chat AI floating widget (client-side)
- **`product-card.tsx`** — Card prodotto riutilizzabile
- **`inquiry-form.tsx`** — Form richieste personalizzate
- **`ui/`** — Primitivi Radix UI (Button, Dialog, Select, etc.)

### Theme & Design

File: `src/styles.css`

Colori personalizzati (Tailwind @theme):
- **Primary:** `--color-accent: #c4a574` (oro/bronze)
- **Background:** `--color-bg: #0c0b09` (nero profondo)
- **Surfaces:** `--color-surface: #151310`, `--color-surface-2: #1d1914`
- **Text:** `--color-fg: #ede6d9` (panna), `--color-muted: #9a8e7c`
- **Wine:** `--color-wine: #6b2c3e`

Fonts:
- **Display:** "Cormorant Garamond" (titoli)
- **Sans:** "Outfit" (corpo)

## API Endpoints

### `/api/pooly-chat` (POST)
Chat AI con xAI backend. Legge `XAI_API_KEY` dal server env.

**Request:**
```json
{
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "context": {
    "page": "/catalogo",
    "model": "grok-2"
  }
}
```

**Response:**
```json
{ "reply": "Risposta assistente..." }
```

### `/api/pooly-save` (POST)
Salva storico chat su database (persistenza server-side).

**Request:**
```json
{
  "history": [{ "role": "user", "content": "..." }, ...]
}
```

## Licenza

Codice e contenuti di Pooly's Mood. Tutti i diritti riservati.

## GitHub + Vercel

### 1. GitHub
Da VS Code, apri questa cartella come progetto e poi esegui:

```bash
git init
git add .
git commit -m "Initial Poolys Mood"
git branch -M main
git remote add origin https://github.com/Poolys/Sito-Mood.git
git push -u origin main
```

Se il repository GitHub esiste già con altri contenuti, **non** eseguire questi comandi alla cieca: collega il remote corretto e fai prima un pull/rebase.

### 2. Vercel
Importa il repository `Poolys/Sito-Mood` in Vercel.

Impostazioni consigliate:
- Framework: Vite / rilevamento automatico
- Install Command: `npm ci --no-audit --no-fund`
- Build Command: `npm run build`
- Output Directory: lascia quello rilevato automaticamente
- Node.js: 20.19+ (22.x consigliato)

Environment variables (se necessario):
- `DATABASE_URL` — PostgreSQL connection string (Neon, Supabase)
- `XAI_API_KEY` — API key per xAI Grok (chat AI)

Dopo ogni `git push` sul branch collegato, Vercel eseguirà automaticamente il nuovo deploy.

## Troubleshooting

### Chat PoolyAI non funziona
1. Verifica `/api/pooly-chat` sia raggiungibile: `curl http://localhost:8080/api/pooly-chat`
2. Controlla `XAI_API_KEY` sia valorizzato su Vercel (Production env vars)
3. Leggi console browser per errori di rete

### Build fallisce con "Cannot find module"
```bash
npm install
npm run typecheck
```

### Scroll chat non sincronizzato (SSR)
Risoltto in `src/components/pooly-ai.tsx` con `setTimeout` nel useEffect. Se persiste, clearare localStorage:
```js
localStorage.removeItem("pooly-chat-history")
```

### Tema non applicato a PoolyAI
Assicurati che `@theme` in `src/styles.css` sia caricato prima di `pooly-ai.tsx`. Usare classi Tailwind (`bg-accent`, `text-fg`) invece di hex hardcoded.

## Recent Fixes

- **2026-10-03:** 
  - Align error component con theme luxury (use `bg-bg`/`text-fg`)
  - Localizzare fallback error message in IT
  - Convertire PoolyAI colors a Tailwind theme variables
  - Fix SSR scroll race condition con `setTimeout`
  - Aggiungere error toast con Sonner per feedback utente
  - Context dinamico (page, model) basato su `useLocation()`
