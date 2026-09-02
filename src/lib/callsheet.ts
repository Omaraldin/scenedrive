"use client";
import { useSyncExternalStore } from "react";

/** Tiny cross-section store: which cars are on the visitor's call sheet. Persisted per browser. */
const KEY = "scenedrive.callsheet";
let cars: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) cars = JSON.parse(raw);
  } catch {}
}
function persist() {
  try { window.localStorage.setItem(KEY, JSON.stringify(cars)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }
function subscribe(l: () => void) { load(); listeners.add(l); return () => listeners.delete(l); }
function getSnapshot() { return cars; }
const EMPTY: string[] = [];
function getServerSnapshot() { return EMPTY; }

export const callSheet = {
  add(id: string) { if (!cars.includes(id)) { cars = [...cars, id]; persist(); emit(); } },
  remove(id: string) { cars = cars.filter((c) => c !== id); persist(); emit(); },
  toggle(id: string) {
    if (cars.includes(id)) callSheet.remove(id);
    else callSheet.add(id);
  },
  clear() { cars = []; persist(); emit(); },
};

export function useCallSheet() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { cars: list, ...callSheet, has: (id: string) => list.includes(id) };
}
