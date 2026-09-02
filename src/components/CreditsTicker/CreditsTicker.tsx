"use client";
import { productions, brands } from "@/data/productions";
import { site } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n";
import styles from "./CreditsTicker.module.css";

type Detail = { id: string } | { brand: string };
type Item = { key: string; label: string; detail: Detail };

/* Row 1: one label per title. Arabic edition reads titleAr when the production has one, otherwise the Latin title. */
function titleItemsFor(locale: Locale): Item[] {
  return productions
    .filter((p) => p.type === "film" || p.type === "series")
    .map((p) => ({ key: p.id, label: locale === "ar" ? p.titleAr ?? p.title : p.title, detail: { id: p.id } }));
}

/* Row 2: brand names stay Latin in both editions. */
const brandItems: Item[] = brands.map((b) => ({ key: b, label: b, detail: { brand: b } }));

function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function credit(detail: Detail) {
  window.dispatchEvent(new CustomEvent("scenedrive:credit", { detail }));
  jump("filmography");
}

/** Focus scrolls the row to reveal a masked item; once focus leaves, snap back so the loop stays seamless. */
function snapBack(e: React.FocusEvent<HTMLDivElement>) {
  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) e.currentTarget.scrollLeft = 0;
}

/** One marquee row: the item list twice, so a 50% translate loops without a seam. */
function Row({ items, className, label }: { items: Item[]; className: string; label: string }) {
  const copy = (dup: boolean) => (
    <div className={styles.list} aria-hidden={dup || undefined}>
      {items.map((it) => (
        <button key={it.key} type="button" className={styles.item} tabIndex={dup ? -1 : 0} onClick={() => credit(it.detail)}>
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
  return (
    <div className={`${styles.row} ${className}`} role="group" aria-label={label} onBlur={snapBack}>
      <div className={styles.track}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

/** Trust bar under the hero: end-credits marquee of titles and brands, plus the four numbers that matter. */
export default function CreditsTicker() {
  const { locale, t } = useT();
  const { stats } = t.credits;

  /* Headline numbers: copy from the dictionary, the year from site.ts so it never drifts from the footer. */
  const STATS: { key: string; n: string; sup?: string; label: string; to?: string }[] = [
    { key: "cars", n: stats.cars.n, label: stats.cars.label },
    { key: "productions", n: stats.productions.n, sup: stats.productions.sup, label: stats.productions.label },
    { key: "since", n: String(site.since), label: stats.since.label },
    { key: "take", n: stats.take.n, label: stats.take.label, to: "scenes" },
  ];

  return (
    <section id="credits" className={`section ${styles.credits}`}>
      <h2 className="sr-only">{t.nav.credits}</h2>
      <div>
        <Row items={titleItemsFor(locale)} className={styles.titles} label={t.credits.rowFilms} />
        <Row items={brandItems} className={styles.brands} label={t.credits.rowBrands} />
      </div>
      <div className="wrap">
        <div className={styles.stats}>
          {STATS.map((s) => {
            const to = s.to;
            const inner = (
              <>
                <span className={`display num ${styles.n}`}>
                  {s.n}
                  {s.sup && <span className={styles.sup}>{s.sup}</span>}
                </span>
                <span className={styles.l}>{s.label}</span>
              </>
            );
            return to ? (
              <a key={s.key} href={`#${to}`} className={`${styles.stat} ${styles.link}`} onClick={(e) => { e.preventDefault(); jump(to); }}>
                {inner}
              </a>
            ) : (
              <div key={s.key} className={styles.stat}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
