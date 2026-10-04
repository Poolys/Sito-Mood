# VS Code Setup Checklist per Vercel Deploy

## 🔧 Prerequisites (Da fare PRIMA di pushare a Vercel)

### 1. Clonare il repository in VS Code
```bash
git clone https://github.com/Poolys/Sito-Mood.git
cd Sito-Mood
```

### 2. Installare dipendenze
```bash
npm install
```
**Verifica:** Nessun errore di conflitto o missing peer dependencies.

---

## 📋 Checklist Pre-Deploy (in VS Code)

### STEP 1: Verificare la Configurazione
- [ ] `package.json` — versione Node 20.19+ o 22.x
  ```bash
  node --version  # Deve essere >= 20.19.0
  ```

- [ ] `.env.local` (file locale, NON committare)
  ```
  # Solo per development
  DATABASE_URL=postgresql://user:pass@localhost:5432/poolys_mood
  XAI_API_KEY=xai_...  # Fake key per testing locale
  ```
  **⚠️ Non committare .env.local — aggiungere a .gitignore se manca**

### STEP 2: TypeScript & Linting
```bash
npm run typecheck
```
**Verifica:** 0 errori di tipo. Output deve terminare con successo.

```bash
npm run lint
```
**Verifica:** Nessun errore ESLint (warnings sono OK).

### STEP 3: Build Locale
```bash
npm run build
```
**Verifica:**
- ✅ Build completa senza errori
- ✅ Nessun warning critici (parse errors, failed imports)
- ✅ Cartella `dist/` creata
- ✅ Verifica che non sia presente `.env.local` nel dist (secret leak)

### STEP 4: Preview Locale
```bash
npm run preview:restart
```
**Testa su localhost:8081:**
- [ ] Homepage carica (hero, collezione, citazioni visibili)
- [ ] Catalogo funziona (filtri, ricerca, card visibili)
- [ ] PoolyAI widget appare in basso a destra
- [ ] Language toggle (IT/EN/DE) funziona
- [ ] Mobile responsive (F12 → toggle device toolbar)
- [ ] Nessun errore in console browser (F12 → Console)

### STEP 5: Smoke Test Browser
```bash
npm run build
node scripts/browser-smoke.mjs
```
**Verifica output JSON:**
```json
{
  "desktop": { "hasContent": true, "consoleErrors": [] },
  "mobile": { "hasContent": true, "consoleErrors": [] }
}
```
**Se fallisce:** correggi errori e ri-run finché non passa.

---

## 🚀 STEP 6: Git & Commit

### 6.1 Stato repo
```bash
git status
```
**Verifica:**
- [ ] Tutti i file critici sono committati
- [ ] `.env.local`, `node_modules/`, `dist/` **non** sono in staging
- [ ] `.gitignore` contiene:
  ```
  .env.local
  .env*.local
  node_modules/
  dist/
  build/
  .vite/
  ```

### 6.2 Aggiungere e committare
```bash
git add .
git commit -m "fix: final pre-deploy corrections and docs"
```

### 6.3 Pushare a GitHub
```bash
git push origin main
```
**Verifica:**
- [ ] Push completato senza errori
- [ ] GitHub mostra l'ultimo commit su branch `main`
- [ ] https://github.com/Poolys/Sito-Mood/tree/main aggiornato

---

## 🌐 STEP 7: Setup Vercel

### 7.1 Andare su Vercel
1. Apri https://vercel.com
2. Login con account GitHub
3. Clicca **"Add New..."** → **"Project"**

### 7.2 Importare Repository
- [ ] Seleziona **Poolys/Sito-Mood**
- [ ] Framework: **Vite** (auto-detect, conferma)
- [ ] Root Directory: **./** (default)

### 7.3 Build & Deploy Settings
Verifica che siano esattamente così:
```
Install Command:       npm ci --no-audit --no-fund
Build Command:         npm run build
Output Directory:      .output (auto-detect, or dist)
Node.js Version:       22.x (or 20.19+)
```

### 7.4 Environment Variables (CRITICO)
Clicca **"Environment Variables"** e aggiungi:

| Variabile | Valore | Scope |
|-----------|--------|-------|
| `DATABASE_URL` | `postgresql://...` | Production |
| `XAI_API_KEY` | `xai_...` | Production |

**⚠️ ATTENZIONE:**
- NON mettere secrets in codice o README
- Usa sempre Vercel dashboard per env vars
- Sono visibili solo a chi ha accesso al progetto

### 7.5 Deploy
- [ ] Clicca **"Deploy"**
- [ ] Aspetta che il build completi (3-5 min)
- [ ] Verifica status: 🟢 verde = successo

---

## ✅ STEP 8: Verifica Post-Deploy

### 8.1 Visita il live site
URL: `https://sito-mood.vercel.app`

Testa:
- [ ] Homepage carica senza flash/bianco
- [ ] Tutte le immagini caricate (`/products`, `/mood`, `/progetti`)
- [ ] PoolyAI widget presente
- [ ] Catalogo funziona, filtri rispondono
- [ ] Language toggle cambia testo
- [ ] Console browser: **zero errori** (F12 → Console)
- [ ] Mobile: nessun overflow orizzontale

### 8.2 Testa la chat PoolyAI
1. Clicca bottone PoolyAI (basso a destra)
2. Scrivi: "Cerco un espositore per 30 bottiglie"
3. Aspetta risposta
4. **Atteso:** Messaggio bot appare dopo 2-3 sec
5. **Se fallisce:** 
   - Controlla XAI_API_KEY in Vercel env vars
   - Verifica che `/api/pooly-chat` sia raggiungibile
   - Leggi Vercel logs

### 8.3 Verifica Errori
Apri Vercel Dashboard → **Logs**:
- [ ] Build log: zero errori, solo warnings
- [ ] Runtime log: nessuno (se no chat, avrà errori API)

---

## 🔍 STEP 9: Final Sanity Check

### Checklist Browser (Desktop + Mobile)
| Feature | Desktop | Mobile | Note |
|---------|---------|--------|------|
| Hero sezione | ✅ | ✅ | Load immagine background |
| Catalogo filtri | ✅ | ✅ | Clicca categorie |
| Ricerca | ✅ | ✅ | Tipo "Wall" → filtra |
| PoolyAI | ✅ | ✅ | Bottone fisso, chat apre |
| Language toggle | ✅ | ✅ | Testo cambia IT/EN/DE |
| Footer link | ✅ | ✅ | Email clicca, link funziona |
| Mobile menu | ❌ | ✅ | Hamburger apre nav |

### Console Check (F12)
```
❌ No errors
❌ No failed module imports
❌ No CORS warnings
❌ No hydration mismatches
✅ XAI_API_KEY not exposed in network tab
```

---

## 🚨 Troubleshooting Rapido

### Build fallisce in Vercel
```bash
# In VS Code, ricrea la build
rm -rf dist node_modules
npm install
npm run build
npm run typecheck
```
Se passa locale ma fallisce in Vercel → controlla:
- [ ] `.env.local` non è committato
- [ ] Node version mismatch (usa 22.x)
- [ ] Missing environment variables

### Chat PoolyAI mostra errore
1. Apri Vercel Logs → **Runtime**
2. Cerca errori da `/api/pooly-chat`
3. Verifica `XAI_API_KEY` è settato
4. Se key è fake/scaduta → aggiorna in Vercel env vars

### Immagini non caricate
- [ ] Verifica `/public/products`, `/public/mood`, `/public/progetti` esistono
- [ ] Percorsi in `src/lib/catalog.ts` sono corretti (es. `/products/p-gaudium.jpg`)
- [ ] Vercel ha accesso alla cartella `public/`

### Tema colori sbagliato
- [ ] Controlla `src/styles.css` sia committato
- [ ] Verifica `@theme` sia caricato in `<head>`
- [ ] Hard-reload browser (Ctrl+Shift+R)

---

## 📝 Istruzioni Finali per Vercel Deploy

### Riassunto in 1 minuto:
1. **VS Code:**
   ```bash
   npm run typecheck && npm run lint && npm run build
   git add . && git commit -m "ready for vercel"
   git push origin main
   ```

2. **Vercel Dashboard:**
   - Importa Poolys/Sito-Mood
   - Aggiungi env vars: `DATABASE_URL`, `XAI_API_KEY`
   - Clicca Deploy

3. **Verifica:**
   - Vai su https://sito-mood.vercel.app
   - Testa homepage, catalogo, PoolyAI
   - Console browser: 0 errori

### Next Steps Post-Deploy:
- [ ] Configura custom domain (se disponibile)
- [ ] Setup monitoring (Vercel Analytics)
- [ ] Backup environment variables
- [ ] Documenta endpoint API in postman (se necessario)

---

**Pronto? Ecco il pulsante verde:** 🟢 **git push origin main** → vai a vercel.com e deploy!
