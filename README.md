# Pooly's Mood

Sito premium di **Pooly's Mood** — espositori, arredi e allestimenti su misura per il vino.

Pensato per cantine, enoteche e hospitality di lusso.

**Live (dopo deploy):** configurare su Vercel (vedi sezione Pubblicazione).

## Pagine

- Home — hero, collezione, atelier, progetti
- Catalogo — filtri per categoria e schede prodotto
- Atelier — lavorazioni e materiali
- Progetti — pezzi unici
- Personalizza — configuratore richiesta
- Contatto — form di richiesta
- Licensing / Termini
- Preferiti e Richieste (localStorage)

Lingue: **Italiano**, **English**, **Deutsch**.

## Stack

- React 19 + TanStack Start / Router
- Tailwind CSS v4
- Vite 8
- Vercel

## Avvio in locale (VS Code)

```bash
npm install
npm run dev
```

Apri http://localhost:8080

Build di produzione:

```bash
npm run build
```

## Contenuti

- `src/lib/catalog.ts` — prodotti e categorie
- `src/lib/i18n.ts` — testi IT/EN/DE
- `public/products`, `public/mood`, `public/progetti` — immagini

## Note tecniche

- Preferiti, configurazioni inviate e conversazioni non ancora spedite sono salvati in **localStorage** (nessun account utente). I dati personali del modulo non vengono salvati nel browser.
- Moduli e conversazioni vengono inviati via email tramite FormSubmit all’indirizzo in `src/lib/site.ts` (richiede l’eventuale attivazione iniziale del destinatario da parte del servizio).
- Auth/DB scaffold è presente ma **disattivato** (non serve per questo sito). Puoi rimuovere la cartella `src/lib/auth` e `migrations` in un secondo momento se vuoi un repo più leggero.
- Script di produzione (distinta pannelli, foglio di lavoro) sono in un pacchetto separato (`production-tools.zip`).

## Pubblicazione (GitHub + Vercel)

Vedi il file `PUBBLICAZIONE.md` per la checklist completa.

## Licenza

Codice e contenuti di Pooly's Mood. Tutti i diritti riservati.
