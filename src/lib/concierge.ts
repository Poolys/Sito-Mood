import knowledge from "./espositori.json" with { type: "json" };

export type Lang = "it" | "en" | "de";

type L10n = Record<Lang, string>;

export type Exhibitor = {
  id: string;
  nome: string;
  tipo: string;
  famiglia: L10n;
  misure_mm: { larghezza: number; altezza: number; profondita: number } | null;
  su_misura: boolean;
  capienza: L10n;
  frase: L10n;
  descrizione: L10n;
  scheda: Record<Lang, string[]>;
  alias: string[];
};

type Knowledge = {
  materiali: { legni: L10n[]; acciai: L10n[] };
  espositori: Exhibitor[];
};

const data = knowledge as Knowledge;

const copy = {
  it: {
    greet:
      "Sono l'atelier. Rispondo solo sugli espositori: misure, materiali, capienza. Chiedimi un modello.",
    refuse:
      "Posso parlare solo degli espositori in collezione. Per esempio P Gaudium, Art Wall, Wall Bar o Porta Gaudium de Vino.",
    noPrice: "In scheda non c'è un prezzo. ",
    list: "In collezione ci sono:",
    woods: "I legni in scheda sono",
    steels: "Gli acciai in scheda sono",
    made: "Su misura",
    width: "larghezza",
    height: "altezza",
    depth: "profondità",
    capacity: "Capienza",
    measures: "Misure",
    family: "Famiglia",
  },
  en: {
    greet:
      "I am the atelier. I only answer about the displays: sizes, materials, capacity. Ask me about a model.",
    refuse:
      "I can only talk about the displays in the collection. For example P Gaudium, Art Wall, Wall Bar or Porta Gaudium de Vino.",
    noPrice: "There is no price on the sheet. ",
    list: "In the collection:",
    woods: "The woods on the sheet are",
    steels: "The steels on the sheet are",
    made: "Made to measure",
    width: "width",
    height: "height",
    depth: "depth",
    capacity: "Capacity",
    measures: "Sizes",
    family: "Family",
  },
  de: {
    greet:
      "Ich bin das Atelier. Ich antworte nur zu den Displays: Maße, Materialien, Kapazität. Frag mich nach einem Modell.",
    refuse:
      "Ich spreche nur über die Displays der Kollektion. Zum Beispiel P Gaudium, Art Wall, Wall Bar oder Porta Gaudium de Vino.",
    noPrice: "In der Kartei steht kein Preis. ",
    list: "In der Kollektion:",
    woods: "Die Hölzer in der Kartei sind",
    steels: "Die Stähle in der Kartei sind",
    made: "Maßanfertigung",
    width: "Breite",
    height: "Höhe",
    depth: "Tiefe",
    capacity: "Kapazität",
    measures: "Maße",
    family: "Familie",
  },
} as const;

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function isGreeting(q: string) {
  return /^(ciao|salve|buongiorno|buonasera|buondi|hey|hello|hi|hallo|guten tag|servus|bonjour)\b/.test(q);
}

function isList(q: string) {
  return /(espositor|catalogo|collezion|modelli|quali pezzi|quali avete|che pezzi|what do you have|which (models|pieces)|collection|aussteller|kollektion|welche modelle)/.test(
    q,
  );
}

function asksPrice(q: string) {
  return /(prezz|costa|costo|quanto costa|price|euro|\b€\b|kaufpreis)/.test(q);
}

function asksWoods(q: string) {
  return /(legni|legno|rovere|noce|castagno|ciliegio|oak|walnut|chestnut|cherry|holz|eiche|nuss)/.test(q);
}

function asksSteels(q: string) {
  return /(inox|acciaio|acciai|satinato|specchio|nero opaco|stainless|edelstahl|stahl)/.test(q);
}

type Focus = "altezza" | "larghezza" | "profondita" | "capienza" | "materiali" | "misure" | "tutto";

function focusOf(q: string): Focus {
  if (/(altezz|quanto e alto|\balto\b|height|how tall|hoch|hoehe)/.test(q)) return "altezza";
  if (/(larghezz|\blargo\b|width|breit)/.test(q)) return "larghezza";
  if (/(profond|depth|spessore di|tief)/.test(q)) return "profondita";
  if (/(capienz|bottigl|quante|capacity|flaschen|how many)/.test(q)) return "capienza";
  if (/(material|scheda|dettagli|legno|inox|acciaio|led|vetro|wood|steel|holz)/.test(q)) return "materiali";
  if (/(misur|dimension|formato|size|masse|grosse)/.test(q)) return "misure";
  return "tutto";
}

function score(ex: Exhibitor, q: string) {
  let s = 0;
  const name = fold(ex.nome);
  if (q.includes(name)) s += 16;
  for (const alias of ex.alias) {
    const a = fold(alias);
    if (a.length > 2 && (q.includes(a) || q.split(/[^a-z0-9]+/).includes(a))) s += 6;
  }
  const family = fold(Object.values(ex.famiglia).join(" "));
  for (const token of q.split(/[^a-z0-9]+/)) {
    if (token.length > 3 && family.includes(token)) s += 4;
  }
  if (q.includes("porta") || q.includes("soglia")) {
    if (ex.id === "porta-gaudium") s += 10;
    if (ex.id === "p-gaudium") s -= 4;
  }
  if (q.includes("monogramma") || q.includes("iniziale") || q.includes("p gaudium")) {
    if (ex.id === "p-gaudium") s += 10;
  }
  const blob = fold(
    [ex.descrizione.it, ex.descrizione.en, ex.scheda.it.join(" "), ex.capienza.it].join(" "),
  );
  let hits = 0;
  for (const token of q.split(/[^a-z0-9]+/)) {
    if (token.length > 4 && blob.includes(token)) hits += 1;
  }
  s += Math.min(hits, 4);
  return s;
}

function measures(ex: Exhibitor, lang: Lang) {
  const t = copy[lang];
  const m = ex.misure_mm;
  if (!m || (!m.larghezza && !m.altezza && !m.profondita)) return t.made;
  const parts = [
    m.larghezza ? `${t.width} ${m.larghezza} mm` : "",
    m.altezza ? `${t.height} ${m.altezza} mm` : "",
    m.profondita ? `${t.depth} ${m.profondita} mm` : "",
  ].filter(Boolean);
  return parts.join(", ");
}

function line(ex: Exhibitor, lang: Lang) {
  return `${ex.nome} — ${ex.famiglia[lang]}. ${ex.capienza[lang]}.`;
}

function detail(ex: Exhibitor, lang: Lang, focus: Focus) {
  const t = copy[lang];
  const m = ex.misure_mm;
  if (focus === "altezza") {
    return m?.altezza
      ? `${ex.nome}: ${t.height} ${m.altezza} mm.`
      : `${ex.nome}: ${t.made}.`;
  }
  if (focus === "larghezza") {
    return m?.larghezza
      ? `${ex.nome}: ${t.width} ${m.larghezza} mm.`
      : `${ex.nome}: ${t.made}.`;
  }
  if (focus === "profondita") {
    return m?.profondita
      ? `${ex.nome}: ${t.depth} ${m.profondita} mm.`
      : `${ex.nome}: ${t.made}.`;
  }
  if (focus === "capienza") return `${ex.nome}: ${t.capacity}: ${ex.capienza[lang]}.`;
  if (focus === "misure") return `${ex.nome}: ${t.measures}: ${measures(ex, lang)}.`;
  if (focus === "materiali") {
    return `${ex.nome}. ${ex.scheda[lang].join(" ")}`;
  }
  return [
    `${ex.nome} — ${ex.frase[lang]}`,
    ex.descrizione[lang],
    `${t.family}: ${ex.famiglia[lang]}.`,
    `${t.capacity}: ${ex.capienza[lang]}.`,
    `${t.measures}: ${measures(ex, lang)}.`,
  ].join(" ");
}

export function replyToVisitor(question: string, lang: Lang) {
  const q = fold(question.trim());
  const t = copy[lang];
  if (!q) return t.greet;
  if (isGreeting(q) && q.length < 24) return t.greet;

  const ranked = data.espositori
    .map((ex) => ({ ex, s: score(ex, q) }))
    .filter((row) => row.s > 0)
    .sort((a, b) => b.s - a.s);

  const top = ranked[0];
  const second = ranked[1];
  const winner = top && top.s >= 8 && (!second || top.s >= second.s + 4) ? top.ex : null;
  const price = asksPrice(q);

  if (winner) {
    const body = detail(winner, lang, focusOf(q));
    return price ? `${t.noPrice}${body}` : body;
  }

  if (!winner && (isList(q) || ranked.some((row) => row.s >= 4))) {
    const rows = isList(q) && (!top || top.s < 8) ? data.espositori.map((ex) => ({ ex })) : ranked.filter((row) => row.s >= 4).slice(0, 6);
    const body = `${t.list}\n${rows.map((row) => line(row.ex, lang)).join("\n")}`;
    return price ? `${t.noPrice}${body}` : body;
  }

  if (asksWoods(q) && !asksSteels(q)) {
    return `${t.woods}: ${data.materiali.legni.map((w) => w[lang]).join(", ")}.`;
  }
  if (asksSteels(q) && ranked.length === 0) {
    return `${t.steels}: ${data.materiali.acciai.map((w) => w[lang]).join(", ")}.`;
  }

  return t.refuse;
}

export const conciergeCopy = {
  it: {
    title: "Atelier",
    sub: "Solo espositori",
    placeholder: "Chiedi di un espositore",
    send: "Invia",
    close: "Chiudi",
    open: "Apri la chat degli espositori",
    prompt: "Posso aiutarti?",
    note: "La conversazione viene inviata via email quando chiudi la chat o lasci il sito.",
    closeToSend: "Chiudi la chat per inviare la conversazione all’atelier.",
    clearConversation: "Cancella chat da questo dispositivo",
    sendingConversation: "Invio in corso…",
    conversationSent: "Conversazione inviata all’atelier.",
    conversationFailed: "Invio non riuscito. La conversazione è ancora salvata qui.",
  },
  en: {
    title: "Atelier",
    sub: "Displays only",
    placeholder: "Ask about a display",
    send: "Send",
    close: "Close",
    open: "Open the display chat",
    prompt: "Can I help?",
    note: "The conversation is emailed when you close the chat or leave the site.",
    closeToSend: "Close the chat to send the conversation to the atelier.",
    clearConversation: "Clear chat from this device",
    sendingConversation: "Sending…",
    conversationSent: "Conversation sent to the atelier.",
    conversationFailed: "Couldn't send it. The conversation is still saved here.",
  },
  de: {
    title: "Atelier",
    sub: "Nur Displays",
    placeholder: "Frag nach einem Display",
    send: "Senden",
    close: "Schließen",
    open: "Display-Chat öffnen",
    prompt: "Kann ich helfen?",
    note: "Das Gespräch wird per E-Mail gesendet, wenn Sie den Chat schließen oder die Website verlassen.",
    closeToSend: "Schließen Sie den Chat, um das Gespräch an das Atelier zu senden.",
    clearConversation: "Chat auf diesem Gerät löschen",
    sendingConversation: "Wird gesendet…",
    conversationSent: "Gespräch an das Atelier gesendet.",
    conversationFailed: "Senden fehlgeschlagen. Das Gespräch ist weiterhin hier gespeichert.",
  },
} as const;
