"use client";
import { useSyncExternalStore } from "react";

/**
 * The sheet's text fields, persisted per browser. Same shape of store as src/lib/callsheet.ts so it hydrates without a mismatch.
 * `type` holds a key of t.book.types ("film", "series", ...), `location` the English entry of book.locations so the saved value
 * is locale-independent; the UI resolves both to the current dictionary.
 */
export type Form = {
  type: string;
  extra: string;
  dates: string;
  location: string;
  action: boolean;
  name: string;
  notes: string;
};

export const EMPTY: Form = { type: "", extra: "", dates: "", location: "", action: false, name: "", notes: "" };

const KEY = "scenedrive.callsheet.form";
let form: Form = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Sheets saved before the dictionary stored the English label; map it to the key. */
const LEGACY_TYPES: Record<string, string> = { Film: "film", Series: "series", Ad: "ad", "Music video": "music", Other: "other" };

function readForm(raw: string): Form {
  // Older sheets carried a `crash` flag; it is read and dropped, never carried over.
  const saved = JSON.parse(raw) as Partial<Record<keyof Form | "crash", unknown>>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const type = str(saved.type);
  return {
    type: LEGACY_TYPES[type] ?? type,
    extra: str(saved.extra),
    dates: str(saved.dates),
    location: str(saved.location),
    action: saved.action === true,
    name: str(saved.name),
    notes: str(saved.notes),
  };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) form = readForm(raw);
  } catch {}
}
function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(form));
  } catch {}
}
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => form;
const getServerSnapshot = () => EMPTY;

export function setField<K extends keyof Form>(key: K, value: Form[K]) {
  form = { ...form, [key]: value };
  persist();
  emit();
}

export function useForm() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
