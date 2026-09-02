import { en, type Dictionary } from "./en";
import { ar } from "./ar";

export type Locale = "en" | "ar";
export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

export function isLocale(x: string): x is Locale {
  return (locales as string[]).includes(x);
}

export function getDictionary(locale: Locale): Dictionary {
  return locale === "ar" ? ar : en;
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Path prefix for a locale. English lives at "/" (rewritten from /en), Arabic at "/ar". */
export function hrefFor(locale: Locale, hash = ""): string {
  return (locale === "en" ? "/" : "/ar") + hash;
}

export type { Dictionary };
