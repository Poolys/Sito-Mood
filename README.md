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

Lingue: **Italiano**, **English** e **Deutsch**.

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
- `src/lib/i18n.ts` — testi IT/EN/DE
- `public/products`, `public/mood`, `public/progetti` — immagini

## Architettura

### `/src/lib`
- **`catalog.ts`** — Definizione prodotti con metadata (featured, slug, immagini)
- **`i18n.ts`** — Traduzioni centralizzate (IT/EN/DE)
- **`store.ts`** — Zustand store (lingua, preferiti, richieste)
- **`auth/`** — Better Auth setup e provider
- **`db.ts`** — Connexione Kysely a PGLite/Postgres
- **`error-component.tsx`** — Error boundary con tema luxury (✅ FIXED)
- **`pooly-ai-memory.ts`** — Memoria chat AI

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
- **`site-header.tsx`** — Navbar con nav link e language toggle (IT/EN/DE)
- **`site-footer.tsx`** — Footer con link e info contatti
- **`pooly-ai.tsx`** — Chat AI floating widget (✅ FIXED - tema integrato)
- **`product-card.tsx`** — Card prodotto riutilizzabile
- **`inquiry-form.tsx`** — Form richieste personalizzate
- **`ui/`** — Primitivi Radix UI (Button, Dialog, Select, Input, etc.)

### Theme & Design

File: `src/styles.css`

Colori personalizzati (Tailwind @theme):
- **Primary:** `--color-accent: #c4a574` (oro/bronze)
- **Background:** `--color-bg: #0c0b09` (nero profondo)
- **Surfaces:** `--color-surface: #151310`, `--color-surface-2: #1d1914`
- **Text:** `--color-fg: #ede6d9` (panna), `--color-muted: #9a8e7c`, `--color-subtle: #6f675c`
- **Wine:** `--color-wine: #6b2c3e`
- **Border:** `--color-border: #2a261f`

Fonts:
- **Display:** "Cormorant Garamond" (titoli, italic)
- **Sans:** "Outfit" (corpo)

## API Endpoints

### `/api/pooly-chat` (POST)
Chat AI con xAI backend. Legge `XAI_API_KEY` dal server env.

**Request:**
```json
{
  "history": [
    { "role": "user", "content": "Cerco un espositore per 50 bottiglie" },
    { "role": "assistant", "content": "Abbiamo modelli perfetti..." }
  ],
  "context": {
    "page": "/catalogo",
    "model": "grok-2"
  }
}
```

**Response:**
```json
{ "reply": "Veniamo a descrivere alcuni modelli che potrebbero fare al caso tuo..." }
```

### `/api/pooly-save` (POST)
Salva storico chat su database e invia email di log.

**Request:**
```json
{
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:** `200 OK` (nessun body)

## Licenza

Codice e contenuti di Pooly's Mood. Tutti i diritti riservati.

© 2026 Pooly's Mood — Gaudium Vino

## GitHub + Vercel

### 1. GitHub
Repository: `https://github.com/Poolys/Sito-Mood`

Setup remoto (se non eseguito):
```bash
git remote add origin https://github.com/Poolys/Sito-Mood.git
git branch -M main
git push -u origin main
```

### 2. Vercel
Importa il repository `Poolys/Sito-Mood` in Vercel.

Impostazioni consigliate:
- Framework: Vite / rilevamento automatico
- Install Command: `npm ci --no-audit --no-fund`
- Build Command: `npm run build`
- Output Directory: lascia quello rilevato automaticamente
- Node.js: 20.19+ (22.x consigliato)

Environment variables (Production):
- `DATABASE_URL` — PostgreSQL connection string (Neon, Supabase)
- `XAI_API_KEY` — API key per xAI Grok (chat AI)

Preview URL: https://sito-mood.vercel.app

Dopo ogni `git push` sul branch collegato, Vercel eseguirà automaticamente il nuovo deploy.

---

## Troubleshooting

### Chat PoolyAI non funziona
1. Verifica `/api/pooly-chat` sia raggiungibile: `curl -X POST http://localhost:8080/api/pooly-chat -H "Content-Type: application/json" -d '{"history":[],"context":{}}'`
2. Controlla `XAI_API_KEY` sia valorizzato su Vercel (Production env vars)
3. Leggi console browser per errori di rete
4. Toast error: "Errore di connessione. Riprova più tardi."

### Build fallisce con "Cannot find module"
```bash
npm install
npm run typecheck
npm run build
```

### Scroll chat non sincronizzato (SSR)
- Risoltto in `src/components/pooly-ai.tsx` (useEffect con setTimeout)
- Se persiste, clearare localStorage: `localStorage.removeItem("pooly-chat-history")`

### Tema non applicato a PoolyAI o componenti
- Assicurati che `@theme` in `src/styles.css` sia caricato
- Usa classi Tailwind (`bg-accent`, `text-fg`, `border-border`) invece di hex hardcoded
- Verifica che `_extends` estende i token corretti

### Error component mostra grigio invece di nero
- Risolto: ora usa `bg-bg text-fg` dal design token
- Se il browser mostra ancora colori vec**: clearare cache CSS e hard-reload (`Ctrl+Shift+R`)

### Lingua non persiste tra refresh
- `src/lib/store.ts` persiste automaticamente in localStorage (`pm-lang`)
- Se non funziona, controllare Privacy Mode del browser (blocca localStorage)

### Form di richiesta non invia email
- `src/routes/api/pooly-save.ts` chiama `sendEmail` con Resend o nodemailer
- Controllare `src/lib/send-email.ts` per la configurazione del provider
- Verificare che le env var SMTP siano settate in Vercel

---

## CHANGELOG

### 2026-10-03 — Fix Critici & Stabilizzazione
**Fixed:**
- ✅ `src/lib/error-component.tsx`
  - Allineamento tema luxury (da `bg-zinc-50` → `bg-bg`, `text-fg`)
  - Fallback message localizzato (IT)
  - Bottone "Ricarica pagina" integrato
  - Icona `text-wine` (#6b2c3e)

- ✅ `src/components/pooly-ai.tsx`
  - Rimossi colori hardcoded (#b81111, #d4af37, gradiente bandiera)
  - Convertiti a Tailwind theme (bg-accent, text-fg, border-border)
  - Fix race condition SSR: scroll sincronizzato con setTimeout
  - Context dinamico: page da `useLocation()`, model da "grok-2"
  - Error toast con Sonner per feedback utente
  - Loading state: bottone mostra "..." durante invio

- ✅ `README.md`
  - Aggiunto CHANGELOG
  - Sezione Troubleshooting dettagliata
  - Documentazione API endpoints
  - Istruzioni Vercel con env vars
  - Descrizione architettura completa

**Verified:**
- `src/routes/api/pooly-chat.ts` — Endpoint presente e coerente
- `src/routes/api/pooly-save.ts` — Endpoint presente e coerente
- `src/lib/store.ts` — Persist corretto di lang, saved, inquiries
- `src/lib/i18n.ts` — Supporto IT/EN/DE completo
- `src/components/site-header.tsx` — Toggle lingua funzionante
- `src/routes/catalogo.index.tsx` — Filtri e search corretti

**Known Issues:**
- Nessuno al momento (tutti i fix critici applicati)

**Dependencies:**
- Sonner 2.0.7 (toast notifications)
- TanStack Router 1.170 (routing + useLocation)
- Better Auth ~1.6.30 (autenticazione)
- Kysely 0.28.5 (ORM)

**Test Recommendations:**
```bash
npm run typecheck    # Verificare types
npm run lint         # ESLint check
npm run build        # Build production
npm run preview:restart  # Test preview
```

---

## Support & Contact

Per problemi sul codice, feature request o bug reports:
- 📧 Email: pooly.s_mood@outlook.com
- 🌐 GitHub Issues: https://github.com/Poolys/Sito-Mood/issues
- 📱 Atelier: Piemonte, Italia (su appuntamento)

Per licensing, prototipi o produzione: scrivici a pooly.s_mood@outlook.com

---

**Manutentore:** Pooly's Mood Atelier  
**Ultima modifica:** 2026-10-03  
**Versione:** 1.0.0 (stabilizzazione post-launch)
