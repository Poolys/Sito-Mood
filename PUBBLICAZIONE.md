# Checklist pubblicazione – Pooly's Mood

Il sito è pensato per essere:
1. Scaricato / clonato in locale
2. Aperto e costruito in **VS Code**
3. Caricato su **GitHub**
4. Pubblicato su **Vercel**

Prima della pubblicazione, conferma che l’indirizzo in `src/lib/site.ts` sia quello definitivo e completa l’eventuale attivazione richiesta da FormSubmit.

---

## 1. Preparazione locale (VS Code)

```bash
# Clona o scarica il progetto
cd poolys-mood

# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev
```

Controlla che tutto funzioni su http://localhost:8080.

Comandi utili:
- `npm run typecheck` — verifica TypeScript
- `npm run build` — build di produzione
- `npm run lint` — lint

---

## 2. GitHub

1. Crea un nuovo repository su GitHub (es. `Poolys/Sito-Mood` o `poolys-mood`).
2. In locale:

```bash
git init
git add .
git commit -m "Initial commit – Pooly's Mood site"
git branch -M main
git remote add origin https://github.com/TUO-USER/TUO-REPO.git
git push -u origin main
```

**Importante:** non committare `.env` o file con chiavi.  
Il file `.gitignore` già esclude `.env`, `.vercel`, `node_modules`, ecc.

---

## 3. Vercel

1. Vai su [vercel.com](https://vercel.com) e collega l’account GitHub.
2. **Import Project** → seleziona il repository.
3. Framework Preset: lascia il rilevamento automatico di Vercel per TanStack Start / Nitro.
4. `vercel.json` imposta già `npm run build`; lascia l’Output Directory su **automatico** così Vercel rileva l’output Nitro.
5. **Deploy**.

### Variabili d’ambiente (Environment Variables) su Vercel

Attualmente **non sono obbligatorie**.  
Aggiungile solo se/quando servono:

| Variabile | Quando serve | Note |
|-----------|--------------|------|
| `DATABASE_URL` | Solo se attivi Neon / Postgres | Lascia vuoto → usa PGLite locale (non persistente su Vercel) |
| Altre chiavi email/API | Se cambi da formsubmit.co a Resend / SendGrid / etc. | Vedi sotto |

---

## 4. Cosa aggiungere / cambiare dopo (quando hai i dati definitivi)

### Email

- L’indirizzo unico di ricezione è configurato in `src/lib/site.ts` e viene usato sia nel sito sia negli invii server.
- Il modulo e il concierge inviano i dati tramite FormSubmit; verifica l’eventuale email di attivazione del destinatario e fai una prova reale dopo il deploy.

- **Footer contatto**:  
  File: `src/components/site-footer.tsx`  
  Stesso indirizzo email.

Se in futuro vuoi usare un servizio professionale (Resend, SendGrid, Postmark…):
1. Crea account e prendi l’API key.
2. Aggiungi la variabile su Vercel (es. `RESEND_API_KEY`).
3. Modifica `concierge-mail.server.ts` per usare quel servizio.

### Dominio personalizzato

Su Vercel → Project → Settings → Domains → aggiungi `www.poolysmood.com` (o il dominio che avrai).

### Analytics / SEO (opzionale)

- Google Analytics / Plausible → aggiungi lo script in `__root.tsx` o via Vercel Analytics.
- Verifica Search Console.

### Immagini e contenuti

- Prodotti e testi: `src/lib/catalog.ts` e `src/lib/i18n.ts`
- Foto: cartelle `public/products`, `public/mood`, `public/progetti`

---

## 5. Dopo il primo deploy

1. Controlla tutte le pagine (Home, Catalogo, dettaglio prodotto, Personalizza, Contatto, Preferiti, Richieste).
2. Prova il form di contatto e invia esplicitamente una conversazione dal Concierge; controlla l’arrivo dei messaggi alla casella configurata.
3. Verifica le 3 lingue (IT / EN / DE).
4. Controlla su mobile.

---

## 6. File da non toccare (o toccare con attenzione)

- `src/routeTree.gen.ts` → generato automaticamente
- Cartella `.grok/` → interna al builder (puoi ignorarla o cancellarla se vuoi un repo più pulito)
- `migrations/` e `src/lib/auth/` → scaffold lasciato ma non attivo. Puoi rimuoverle in un secondo momento.

---

## Riepilogo operazioni minime per andare online

1. `npm install` + `npm run dev` (verifica locale)
2. Push su GitHub
3. Import su Vercel → Deploy
4. (Opzionale) Cambia email in 2 file
5. (Opzionale) Aggiungi dominio personalizzato

Nessuna API key obbligatoria al momento.
