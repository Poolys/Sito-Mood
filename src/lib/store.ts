import { create } from "zustand";
import type { Lang } from "./catalog";

const LANG_KEY = "pm-lang";
const SAVED_KEY = "pm-saved";
const INQ_KEY = "pm-inquiries";

function readLang(): Lang {
  if (typeof window === "undefined") return "it";
  const v = window.localStorage.getItem(LANG_KEY);
  if (v === "it" || v === "en" || v === "de") return v;
  const nav = window.navigator.language.toLowerCase();
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("en")) return "en";
  return "it";
}

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export type Inquiry = {
  id: string;
  at: string;
  model: string;
  wood: string;
  steel: string;
  height: string;
  width: string;
  depth: string;
  bottles: string;
};

function readInquiries(): Inquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INQ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : `${Date.now()}-${Math.random()}`,
        at: typeof item.at === "string" ? item.at : new Date().toISOString(),
        model: typeof item.model === "string" ? item.model : "",
        wood: typeof item.wood === "string" ? item.wood : "",
        steel: typeof item.steel === "string" ? item.steel : "",
        height: typeof item.height === "string" ? item.height : "",
        width: typeof item.width === "string" ? item.width : "",
        depth: typeof item.depth === "string" ? item.depth : "",
        bottles: typeof item.bottles === "string" ? item.bottles : "",
      }));
  } catch {
    return [];
  }
}

type Store = {
  lang: Lang;
  saved: string[];
  inquiries: Inquiry[];
  hydrated: boolean;
  hydrate: () => void;
  setLang: (lang: Lang) => void;
  toggleSaved: (slug: string) => void;
  addInquiry: (data: Omit<Inquiry, "id" | "at">) => void;
  removeInquiry: (id: string) => void;
};

export const useMood = create<Store>((set, get) => ({
  lang: "it",
  saved: [],
  inquiries: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const inquiries = readInquiries();
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(INQ_KEY, JSON.stringify(inquiries));
      } catch {
        // Continue with the sanitized in-memory history if storage is blocked.
      }
    }
    set({ lang: readLang(), saved: readSaved(), inquiries, hydrated: true });
  },
  setLang: (lang) => {
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    set({ lang });
  },
  toggleSaved: (slug) => {
    const next = get().saved.includes(slug)
      ? get().saved.filter((s) => s !== slug)
      : [...get().saved, slug];
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    set({ saved: next });
  },
  addInquiry: (data) => {
    const item: Inquiry = {
      ...data,
      id: `${Date.now()}`,
      at: new Date().toISOString(),
    };
    const next = [item, ...get().inquiries].slice(0, 20);
    set({ inquiries: next });
    try {
      window.localStorage.setItem(INQ_KEY, JSON.stringify(next));
    } catch {
      // Keep the in-memory confirmation even when browser storage is unavailable.
    }
  },
  removeInquiry: (id) => {
    const next = get().inquiries.filter((item) => item.id !== id);
    set({ inquiries: next });
    try {
      window.localStorage.setItem(INQ_KEY, JSON.stringify(next));
    } catch {
      // The in-memory list still reflects the removal for this session.
    }
  },
}));
