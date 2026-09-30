export type Lang = "it" | "en" | "de";
export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;
export type Category = "parete" | "terra" | "servizio" | "allestimenti" | "soglia";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  featured?: boolean;
  image: string;
  width: number;
  height: number;
  depth: number;
  customSize?: boolean;
  capacity: Localized;
  claim: Localized;
  intro: Localized;
  story: Localized;
  specs: LocalizedList;
};

export type Project = {
  slug: string;
  image: string;
  title: Localized;
  place: Localized;
  desc: Localized;
};

export const woods = [
  { id: "oak", label: { it: "Rovere massello del Piemonte", en: "Solid Piedmont oak", de: "Massive piemontesische Eiche" } },
  { id: "walnut", label: { it: "Noce italiano", en: "Italian walnut", de: "Italienischer Nussbaum" } },
  { id: "chestnut", label: { it: "Castagno antico", en: "Ancient chestnut", de: "Altes Kastanienholz" } },
  { id: "cherry", label: { it: "Ciliegio selezionato", en: "Selected cherry", de: "Ausgewählte Kirsche" } },
] as const;

export const steels = [
  { id: "mirror", label: { it: "Inox specchio", en: "Mirror stainless steel", de: "Spiegel-Edelstahl" } },
  { id: "brushed", label: { it: "Inox satinato", en: "Brushed stainless steel", de: "Gebürsteter Edelstahl" } },
  { id: "black", label: { it: "Inox nero opaco", en: "Matte black stainless steel", de: "Mattschwarzer Edelstahl" } },
] as const;

export const categories: { id: Category | "all"; label: Localized }[] = [
  { id: "all", label: { it: "Tutti", en: "All", de: "Alle" } },
  { id: "terra", label: { it: "A terra", en: "Freestanding", de: "Standmodelle" } },
  { id: "parete", label: { it: "A parete", en: "Wall", de: "Wand" } },
  { id: "servizio", label: { it: "Servizio", en: "Service", de: "Service" } },
  { id: "allestimenti", label: { it: "Allestimenti", en: "Installations", de: "Installationen" } },
  { id: "soglia", label: { it: "Soglie", en: "Thresholds", de: "Schwellen" } },
];

export const products: Product[] = [
  {
    slug: "p-gaudium",
    name: "P Gaudium",
    category: "terra",
    featured: true,
    image: "/products/p-gaudium.jpg",
    width: 600,
    height: 1400,
    depth: 320,
    capacity: { it: "10 bottiglie orizzontali", en: "10 horizontal bottles", de: "10 liegende Flaschen" },
    claim: {
      it: "Il tuo iniziale. Il nostro orgoglio.",
      en: "Your initial. Our pride.",
      de: "Dein Initial. Unser Stolz.",
    },
    intro: {
      it: "Un monogramma che custodisce il vino. Scultura funzionale, firma visibile.",
      en: "A monogram that holds the wine. Functional sculpture, a visible signature.",
      de: "Ein Monogramm, das den Wein bewahrt. Funktionsskulptur, sichtbare Signatur.",
    },
    story: {
      it: "La P è la nostra firma nello spazio. Un telaio inox oversize accoglie dieci bottiglie in posa orizzontale, sulla base in legno massello incisa Gaudium de Vino. Non è un portabottiglie: è un monogramma abitato.",
      en: "The P is our signature in space. An oversized stainless frame holds ten bottles on their side, on a solid wood base engraved Gaudium de Vino. Not a rack — a lived-in monogram.",
      de: "Das P ist unsere Signatur im Raum. Ein überdimensionierter Edelstahlrahmen nimmt zehn liegende Flaschen auf, auf einem massiven Holzsockel mit Gravur Gaudium de Vino.",
    },
    specs: {
      it: [
        "Telaio inox a forma di P oversize",
        "Base in legno con incisione Gaudium de Vino",
        "10 posizioni bottiglie orizzontali",
        "Altezza 1400 mm · Larghezza 600 mm",
        "Produzione artigianale in Piemonte",
      ],
      en: [
        "Oversized P-shaped stainless steel frame",
        "Wood base with Gaudium de Vino engraving",
        "10 horizontal bottle positions",
        "Height 1400 mm · Width 600 mm",
        "Handcrafted in Piedmont",
      ],
      de: [
        "Überdimensionierter P-Rahmen aus Edelstahl",
        "Holzsockel mit Gravur Gaudium de Vino",
        "10 liegende Flaschenpositionen",
        "Höhe 1400 mm · Breite 600 mm",
        "Handgefertigt im Piemont",
      ],
    },
  },
  {
    slug: "art-wall",
    name: "Art Wall",
    category: "parete",
    featured: true,
    image: "/products/art-wall.jpg",
    width: 400,
    height: 800,
    depth: 125,
    capacity: { it: "5 bottiglie", en: "5 bottles", de: "5 Flaschen" },
    claim: {
      it: "Minimalismo verticale.",
      en: "Vertical minimalism.",
      de: "Vertikaler Minimalismus.",
    },
    intro: {
      it: "Pochi centimetri, massima eleganza. Il vino diventa arte da parete.",
      en: "A few centimetres, maximum elegance. Wine becomes wall art.",
      de: "Wenige Zentimeter, maximale Eleganz. Wein wird zur Wandkunst.",
    },
    story: {
      it: "Cento millimetri di profondità. Cinque ripiani in legno naturale e un tubo inox Ø 42 mm: la cantina che non ruba la stanza, pensata per loft, suite e spazi raccolti.",
      en: "One hundred millimetres of depth. Five natural wood shelves and a Ø 42 mm stainless tube: a cellar that does not steal the room — for lofts, suites, compact spaces.",
      de: "Hundert Millimeter Tiefe. Fünf Naturholzregale und ein Edelstahlrohr Ø 42 mm: der Keller, der dem Raum nichts nimmt.",
    },
    specs: {
      it: [
        "Pezzo unico da parete",
        "Profondità 120–130 mm",
        "Larghezza 400 mm · Altezza 800 mm",
        "5 ripiani in legno naturale",
        "Tubo inox Ø 42 mm",
      ],
      en: [
        "Single wall-mounted piece",
        "Depth 120–130 mm",
        "Width 400 mm · Height 800 mm",
        "5 natural wood shelves",
        "Stainless tube Ø 42 mm",
      ],
      de: [
        "Einzelstück zur Wandmontage",
        "Tiefe 120–130 mm",
        "Breite 400 mm · Höhe 800 mm",
        "5 Naturholzregale",
        "Edelstahlrohr Ø 42 mm",
      ],
    },
  },
  {
    slug: "scaffale-arco",
    name: "Scaffale Arco",
    category: "terra",
    image: "/products/scaffale-arco.jpg",
    width: 600,
    height: 1500,
    depth: 300,
    capacity: { it: "In base ai ripiani", en: "According to shelves", de: "Je nach Regalböden" },
    claim: {
      it: "Eleganza curva, presenza silenziosa.",
      en: "Curved elegance, a quiet presence.",
      de: "Gebogene Eleganz, stille Präsenz.",
    },
    intro: {
      it: "Nella sua semplicità, introverso. Legno e acciaio in armonia.",
      en: "Simple, introverted. Wood and steel in harmony.",
      de: "Schlicht, introvertiert. Holz und Stahl in Harmonie.",
    },
    story: {
      it: "Un arco in tubo inox lucido sostiene ripiani in legno massello. La curva è la firma: niente spigoli che alzano la voce, solo una presenza che tiene lo spazio.",
      en: "A polished stainless tube arch carries solid wood shelves. The curve is the signature: no edges that raise their voice, only a presence that holds the room.",
      de: "Ein polierter Edelstahlbogen trägt massive Holzregale. Die Kurve ist die Signatur: keine Kanten, die die Stimme heben.",
    },
    specs: {
      it: [
        "Struttura in tubo inox lucido",
        "Ripiani in legno massello naturale",
        "Larghezza 600 mm · Altezza 1500 mm · Profondità 300 mm",
        "Capienza in base al numero di ripiani",
        "Produzione artigianale italiana",
      ],
      en: [
        "Polished stainless tube structure",
        "Natural solid wood shelves",
        "Width 600 mm · Height 1500 mm · Depth 300 mm",
        "Capacity according to shelf count",
        "Italian artisan production",
      ],
      de: [
        "Polierte Edelstahlrohr-Struktur",
        "Massive Naturholzregale",
        "Breite 600 mm · Höhe 1500 mm · Tiefe 300 mm",
        "Kapazität je nach Anzahl der Böden",
        "Italienische Handfertigung",
      ],
    },
  },
  {
    slug: "magnium",
    name: "Magnium",
    category: "terra",
    image: "/products/magnium.jpg",
    width: 800,
    height: 1000,
    depth: 360,
    capacity: { it: "Magnum e grandi formati", en: "Magnum and large formats", de: "Magnum und Großformate" },
    claim: {
      it: "Il sostegno per le grandi etichette.",
      en: "Support for your grand labels.",
      de: "Halt für die großen Etiketten.",
    },
    intro: {
      it: "Pensato per le Magnum e per le bottiglie che chiedono spazio, senza chiedere scusa.",
      en: "Made for Magnums and bottles that ask for space — without apology.",
      de: "Für Magnums und Flaschen, die Raum verlangen — ohne Entschuldigung.",
    },
    story: {
      it: "Ripiani più profondi, campata più larga. Il Magnium è il pezzo che ospita le etichette che in cantina restano in piedi da sole. Acciaio lucido, legno massello, proporzioni da grande formato.",
      en: "Deeper shelves, a wider span. Magnium is the piece that hosts the labels that stand on their own in the cellar. Polished steel, solid wood, large-format proportions.",
      de: "Tiefere Böden, weitere Spannweite. Magnium beherbergt die Etiketten, die im Keller für sich stehen.",
    },
    specs: {
      it: [
        "Struttura in tubo inox lucido",
        "Ripiani in legno massello naturale",
        "Altezza 1000 mm · Larghezza 800 mm",
        "Proporzioni per Magnum e jeroboam",
        "Produzione artigianale italiana",
      ],
      en: [
        "Polished stainless tube structure",
        "Natural solid wood shelves",
        "Height 1000 mm · Width 800 mm",
        "Proportions for Magnum and jeroboam",
        "Italian artisan production",
      ],
      de: [
        "Polierte Edelstahlrohr-Struktur",
        "Massive Naturholzregale",
        "Höhe 1000 mm · Breite 800 mm",
        "Proportionen für Magnum und Jeroboam",
        "Italienische Handfertigung",
      ],
    },
  },
  {
    slug: "banchetti",
    name: "Banchetti",
    category: "servizio",
    image: "/products/banchetti.jpg",
    width: 900,
    height: 750,
    depth: 600,
    capacity: { it: "Piano di servizio", en: "Service surface", de: "Servicefläche" },
    claim: {
      it: "Fissi o mobili, sempre presenti.",
      en: "Fixed or mobile, always present.",
      de: "Fest oder mobil, immer da.",
    },
    intro: {
      it: "Stabilità e funzione. Un appoggio sicuro in ogni momento della degustazione.",
      en: "Stability and function. A sure surface at every moment of the tasting.",
      de: "Stabilität und Funktion. Ein sicherer Halt in jedem Moment der Verkostung.",
    },
    story: {
      it: "Il banchetto è il gesto del servizio: altezza 750 mm, piano 900 × 600, struttura inox e legno. Fisso in sala, oppure mobile per seguire la degustazione da un tavolo all’altro.",
      en: "The bench is the gesture of service: 750 mm high, a 900 × 600 top, steel and wood. Fixed in the room, or mobile to follow the tasting from table to table.",
      de: "Die Bank ist die Geste des Service: 750 mm hoch, Platte 900 × 600, Stahl und Holz. Fest im Raum oder mobil.",
    },
    specs: {
      it: [
        "Struttura in tubo inox lucido",
        "Piano in legno massello naturale",
        "Altezza 750 mm · Larghezza 900 mm · Profondità 600 mm",
        "Versione fissa o su ruote",
        "Produzione artigianale italiana",
      ],
      en: [
        "Polished stainless tube structure",
        "Solid natural wood top",
        "Height 750 mm · Width 900 mm · Depth 600 mm",
        "Fixed or castered version",
        "Italian artisan production",
      ],
      de: [
        "Polierte Edelstahlrohr-Struktur",
        "Massive Naturholzplatte",
        "Höhe 750 mm · Breite 900 mm · Tiefe 600 mm",
        "Fest oder auf Rollen",
        "Italienische Handfertigung",
      ],
    },
  },
  {
    slug: "cut-art",
    name: "Cut Art",
    category: "terra",
    featured: true,
    image: "/products/cut-art.jpg",
    width: 600,
    height: 1500,
    depth: 300,
    capacity: { it: "3 bottiglie in presentazione", en: "3 bottles on display", de: "3 Flaschen in Präsentation" },
    claim: {
      it: "Geometria, luce, presenza.",
      en: "Geometry, light, presence.",
      de: "Geometrie, Licht, Präsenz.",
    },
    intro: {
      it: "Tagli precisi, luce integrata. Il vino esposto come opera.",
      en: "Precise cuts, integrated light. Wine shown as a work of art.",
      de: "Präzise Schnitte, integriertes Licht. Wein als Kunstwerk.",
    },
    story: {
      it: "Tre bottiglie, non di più. Il Cut Art è un pezzo di presentazione: geometrie nette, LED calda nel taglio, modulo componibile per chi vuole una sequenza, non un magazzino.",
      en: "Three bottles, no more. Cut Art is a presentation piece: sharp geometry, warm LED in the cut, modular for those who want a sequence, not a warehouse.",
      de: "Drei Flaschen, nicht mehr. Cut Art ist ein Präsentationsstück: klare Geometrie, warmes LED im Schnitt, modular.",
    },
    specs: {
      it: [
        "Modulo componibile",
        "Larghezza 600 mm · Altezza 1500 mm · Profondità 300 mm",
        "Capienza 3 bottiglie in presentazione",
        "Tagli geometrici con LED integrata",
        "Legno massello e inox",
      ],
      en: [
        "Modular piece",
        "Width 600 mm · Height 1500 mm · Depth 300 mm",
        "Capacity: 3 bottles on display",
        "Geometric cuts with integrated LED",
        "Solid wood and stainless steel",
      ],
      de: [
        "Modular aufbaubar",
        "Breite 600 mm · Höhe 1500 mm · Tiefe 300 mm",
        "Kapazität: 3 Flaschen in Präsentation",
        "Geometrische Schnitte mit integriertem LED",
        "Massivholz und Edelstahl",
      ],
    },
  },
  {
    slug: "imagine-capricci",
    name: "Imagine Capricci",
    category: "terra",
    image: "/products/imagine-capricci.jpg",
    width: 900,
    height: 2300,
    depth: 420,
    capacity: { it: "Bottiglie, libri, oggetti", en: "Bottles, books, objects", de: "Flaschen, Bücher, Objekte" },
    claim: {
      it: "Design che non chiede permesso.",
      en: "Design that does not ask permission.",
      de: "Design, das nicht um Erlaubnis fragt.",
    },
    intro: {
      it: "Scala, libreria, cantinetta. Un capriccio di design multifunzione.",
      en: "Stair, library, cellar. A multifunctional design caprice.",
      de: "Treppe, Bibliothek, Weinkeller. Eine multifunktionale Designlaune.",
    },
    story: {
      it: "Alto 2300 mm, l’arco inox con curvatura superiore attraversa la stanza. Mensole in legno per bottiglie, libri, oggetti. Un pezzo che si comporta da architettura, non da mobile.",
      en: "At 2300 mm, the stainless arch with its upper curve crosses the room. Wood shelves for bottles, books, objects. A piece that behaves as architecture, not furniture.",
      de: "Mit 2300 mm durchquert der Edelstahlbogen den Raum. Holzregale für Flaschen, Bücher, Objekte. Ein Stück, das Architektur ist, nicht Möbel.",
    },
    specs: {
      it: [
        "Arco inox con curvatura superiore",
        "Mensole in legno naturale",
        "Altezza 2300 mm",
        "Uso misto: vino, libri, oggetti",
        "Pezzo statement per loft e showroom",
      ],
      en: [
        "Stainless arch with upper curvature",
        "Natural wood shelves",
        "Height 2300 mm",
        "Mixed use: wine, books, objects",
        "Statement piece for lofts and showrooms",
      ],
      de: [
        "Edelstahlbogen mit oberer Krümmung",
        "Naturholzregale",
        "Höhe 2300 mm",
        "Mischnutzung: Wein, Bücher, Objekte",
        "Statement für Lofts und Showrooms",
      ],
    },
  },
  {
    slug: "wall-bar",
    name: "Wall Bar",
    category: "servizio",
    featured: true,
    image: "/products/wall-bar.jpg",
    width: 2400,
    height: 2400,
    depth: 380,
    customSize: true,
    capacity: { it: "Esposizione, scorta, servizio", en: "Display, storage, service", de: "Präsentation, Lager, Service" },
    claim: {
      it: "Bar verticale, pronto a servire.",
      en: "A vertical bar, ready to serve.",
      de: "Vertikale Bar, bereit zum Servieren.",
    },
    intro: {
      it: "Esposizione, conservazione, servizio. Tutto su una parete.",
      en: "Display, storage, service. All on one wall.",
      de: "Präsentation, Lagerung, Service. Alles an einer Wand.",
    },
    story: {
      it: "Ripiani inclinati, barra portabicchieri, ante inferiori, tavolo estraibile inox e LED calda. Il Wall Bar è la parete che lavora: mostra, conserva, serve — senza invadere il pavimento.",
      en: "Inclined shelves, a glass rail, lower doors, a pull-out stainless table and warm LED. Wall Bar is the wall that works: it shows, stores, serves — without taking the floor.",
      de: "Geneigte Regale, Glashalter, untere Türen, ausziehbarer Edelstahltisch und warmes LED. Die Wand, die arbeitet.",
    },
    specs: {
      it: [
        "Ripiani inclinati e barra portabicchieri",
        "Ante inferiori e ripiani nascosti",
        "Tavolo estraibile in inox",
        "LED calda e legno massello",
        "Dimensioni su misura della parete",
      ],
      en: [
        "Inclined shelves and glass-holder rail",
        "Lower doors and hidden shelves",
        "Pull-out stainless steel table",
        "Warm LED and solid wood",
        "Dimensions made to the wall",
      ],
      de: [
        "Geneigte Regale und Glashalterstange",
        "Untere Türen und verdeckte Fächer",
        "Ausziehbarer Edelstahltisch",
        "Warmes LED und Massivholz",
        "Maße nach der Wand",
      ],
    },
  },
  {
    slug: "allestimenti",
    name: "Allestimenti",
    category: "allestimenti",
    image: "/products/allestimenti.jpg",
    width: 0,
    height: 0,
    depth: 0,
    customSize: true,
    capacity: { it: "Fino a 100+ bottiglie", en: "Up to 100+ bottles", de: "Bis zu 100+ Flaschen" },
    claim: {
      it: "Progettati per valorizzare ogni bottiglia.",
      en: "Designed to honour every bottle.",
      de: "Entworfen, um jede Flasche zu ehren.",
    },
    intro: {
      it: "LED calda, bottiglie in evidenza. Per chi degusta con gli occhi prima che col palato.",
      en: "Warm LED, bottles in evidence. For those who taste with the eyes before the palate.",
      de: "Warmes LED, Flaschen im Licht. Für alle, die zuerst mit den Augen verkosten.",
    },
    story: {
      it: "Enoteche, wine bar, sale degustazione: progettiamo la parete intera. Ripiani inclinati illuminati, struttura inox e legno, capienza oltre le cento bottiglie. Ogni allestimento è un disegno, non un catalogo.",
      en: "Wine shops, bars, tasting rooms: we design the whole wall. Lit inclined shelves, steel and wood, capacity beyond a hundred bottles. Every installation is a drawing, not a catalogue line.",
      de: "Weinhandlungen, Bars, Verkostungsräume: wir entwerfen die ganze Wand. Beleuchtete geneigte Regale, Stahl und Holz, über hundert Flaschen.",
    },
    specs: {
      it: [
        "Ripiani inclinati con LED calda",
        "Struttura inox e legno naturale",
        "Fino a 100+ bottiglie",
        "Ideale per enoteche e degustazioni",
        "Progetto su rilievo dello spazio",
      ],
      en: [
        "Inclined shelves with warm LED",
        "Stainless and natural wood structure",
        "Up to 100+ bottles",
        "Ideal for wine bars and tastings",
        "Designed from a site survey",
      ],
      de: [
        "Geneigte Regale mit warmem LED",
        "Edelstahl- und Naturholzstruktur",
        "Bis zu 100+ Flaschen",
        "Ideal für Weinbars und Verkostungen",
        "Entwurf nach Aufmaß vor Ort",
      ],
    },
  },
  {
    slug: "porta-gaudium",
    name: "Porta Gaudium de Vino",
    category: "soglia",
    featured: true,
    image: "/products/porta-gaudium.jpg",
    width: 900,
    height: 2200,
    depth: 80,
    customSize: true,
    capacity: { it: "Soglia, non contenitore", en: "A threshold, not a container", de: "Eine Schwelle, kein Behälter" },
    claim: {
      it: "L’ingresso al piacere.",
      en: "The entrance to pleasure.",
      de: "Der Eingang zum Genuss.",
    },
    intro: {
      it: "Incisa, illuminata, indimenticabile. La soglia che promette emozione.",
      en: "Engraved, lit, unforgettable. The threshold that promises feeling.",
      de: "Graviert, beleuchtet, unvergesslich. Die Schwelle, die Gefühl verspricht.",
    },
    story: {
      it: "Telaio inox, vetro fumé inciso, pannello inferiore in massello, LED opzionale nel profilo. Singola o doppia. La porta non chiude la cantina: la annuncia.",
      en: "Stainless frame, engraved smoked glass, a solid wood lower panel, optional LED in the profile. Single or double. The door does not close the cellar: it announces it.",
      de: "Edelstahlrahmen, graviertes Rauchglas, unteres Massivholzfeld, optionales LED im Profil. Ein- oder zweiflügelig. Die Tür schließt den Keller nicht — sie kündigt ihn an.",
    },
    specs: {
      it: [
        "Telaio inox con vetro fumé inciso",
        "Pannello inferiore in legno massello",
        "LED opzionale nel telaio",
        "Versione anta singola o doppia",
        "Misure su vano esistente",
      ],
      en: [
        "Stainless frame with engraved smoked glass",
        "Solid wood lower panel",
        "Optional LED in the frame",
        "Single or double leaf",
        "Sized to the existing opening",
      ],
      de: [
        "Edelstahlrahmen mit graviertem Rauchglas",
        "Unteres Feld aus Massivholz",
        "Optionales LED im Rahmen",
        "Ein- oder zweiflügelig",
        "Maßgenau für die vorhandene Öffnung",
      ],
    },
  },
];

export const projects: Project[] = [
  {
    slug: "baule-bruciato",
    image: "/progetti/baule-bruciato.jpg",
    title: {
      it: "Espositore baule bruciato",
      en: "Charred trunk display",
      de: "Verkohlter Stamm-Display",
    },
    place: {
      it: "Pezzo unico · Piemonte",
      en: "One-off · Piedmont",
      de: "Unikat · Piemont",
    },
    desc: {
      it: "Un baule di legno bruciato a venatura carbonizzata, scavato per accogliere le bottiglie. La materia parla prima della forma.",
      en: "A charred wood trunk, grain turned to carbon, carved to hold bottles. Material speaks before form.",
      de: "Ein verkohlter Holzstamm, die Maserung zu Kohle geworden, ausgehöhlt für Flaschen. Die Materie spricht vor der Form.",
    },
  },
  {
    slug: "tronco-naturale",
    image: "/progetti/tronco-naturale.jpg",
    title: {
      it: "Portabottiglie tronco naturale",
      en: "Natural trunk bottle rack",
      de: "Flaschenhalter aus Naturstamm",
    },
    place: {
      it: "Pezzo unico · Piemonte",
      en: "One-off · Piedmont",
      de: "Unikat · Piemont",
    },
    desc: {
      it: "Un tronco d’albero lasciato quasi intero. I fori nascono dal legno, non dal disegno. La cantina come presenze vegetali.",
      en: "A tree trunk left almost whole. The openings are born from the wood, not from the drawing. The cellar as a living presence.",
      de: "Ein Stamm, fast ganz gelassen. Die Öffnungen entstehen aus dem Holz, nicht aus der Zeichnung.",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, n = 3) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, n);
  const same = products.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = products.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...same, ...rest].slice(0, n);
}

export function formatMm(n: number, lang: Lang) {
  if (!n) return lang === "en" ? "Made to measure" : lang === "de" ? "Maßanfertigung" : "Su misura";
  return `${n} mm`;
}
