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
- Vercel

## Avvio in locale

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
```

## Contenuti

Catalogo, testi e immagini sono in:

- `src/lib/catalog.ts` — prodotti e categorie
- `src/lib/i18n.ts` — testi IT/EN
- `public/products`, `public/mood`, `public/progetti` — immagini

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

Se usi il database in produzione, aggiungi in Vercel la variabile:
`DATABASE_URL`

Dopo ogni `git push` sul branch collegato, Vercel eseguirà automaticamente il nuovo deploy.
