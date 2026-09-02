import { productions } from "@/data/productions";
import type { Locale } from "@/i18n";

/* Latin production title → Arabic title, from the productions data. A title with a subtitle
   ("Welad Rizk 3: El Qadeya") also maps its short form ("Welad Rizk 3" → Arabic short form), which is
   how the fleet's seenIn lines refer to it. */
const arabicTitles = new Map<string, string>();
for (const p of productions) {
  if (!p.titleAr) continue;
  arabicTitles.set(p.title, p.titleAr);
  const short = p.title.split(":")[0].trim();
  if (!arabicTitles.has(short)) arabicTitles.set(short, p.titleAr.split(":")[0].trim());
}

/** A production reference for the edition: titleAr in Arabic when the data has one, else the Latin title. Accepts "A · B" lists. */
export function productionTitle(name: string, locale: Locale): string {
  if (locale !== "ar") return name;
  const whole = arabicTitles.get(name);
  if (whole) return whole;
  return name.split(" · ").map((s) => arabicTitles.get(s) ?? s).join(" · ");
}
