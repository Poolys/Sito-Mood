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
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  model: string;
  wood: string;
  steel: string;
  height: string;
  width: string;
  depth: string;
  bottles: string;
  notes: string;
};

function readInquiries(): Inquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INQ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
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
};

export const useMood = create<Store>((set, get) => ({
  lang: "it",
  saved: [],
  inquiries: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ lang: readLang(), saved: readSaved(), inquiries: readInquiries(), hydrated: true });
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
    window.localStorage.setItem(INQ_KEY, JSON.stringify(next));
    set({ inquiries: next });
  },
}));
