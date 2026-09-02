"use client";
import { createContext, useContext } from "react";
import type { Dictionary, Locale } from "./index";
import { en } from "./en";

type Ctx = { locale: Locale; t: Dictionary; dir: "ltr" | "rtl" };
const LocaleContext = createContext<Ctx>({ locale: "en", t: en, dir: "ltr" });

export function LocaleProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale, t: dictionary, dir: locale === "ar" ? "rtl" : "ltr" }}>{children}</LocaleContext.Provider>;
}

/** Client hook: current locale + dictionary. Server components import getDictionary(locale) directly instead. */
export function useT(): Ctx {
  return useContext(LocaleContext);
}
