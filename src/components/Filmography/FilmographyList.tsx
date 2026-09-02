"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { productions, type Production, type ProductionType } from "@/data/productions";
import Lightbox, { type LightboxItem } from "@/components/ui/Lightbox";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./Filmography.module.css";

type Tab = "film" | "ad" | "music";

const TABS: Tab[] = ["film", "ad", "music"];

const tabOf = (t: ProductionType): Tab => (t === "film" || t === "series" ? "film" : t === "ad" ? "ad" : "music");

/** Newest first; undated credits sink to the end, data order kept within a year. */
const byYearDesc = (a: Production, b: Production) => (Number(b.year) || 0) - (Number(a.year) || 0);

/** " e etisalat " style key: lowercase, punctuation collapsed to spaces, padded for whole-word matching. */
const key = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;

function findByBrand(brand: string): Production | undefined {
  const b = key(brand);
  const loose = b.replace(/\s/g, "");
  return productions.find((p) => key(p.title).includes(b)) ?? productions.find((p) => key(p.title).replace(/\s/g, "").includes(loose));
}

type CreditDetail = { id?: string; brand?: string };

/** Tabs + auto-scrolling credits crawl; every row opens the shared Lightbox. */
export default function FilmographyList() {
  const { locale, t, dir } = useT();
  const f = t.filmography;
  const [tab, setTab] = useState<Tab>("film");
  const [current, setCurrent] = useState<Production | null>(null);
  /** keyboard users and the "Show all" toggle turn the crawl into a plain list */
  const [expanded, setExpanded] = useState(false);
  /** a list shorter than the crawl viewport has nothing to crawl */
  const [short, setShort] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  /** Arabic edition shows the Arabic title where the credit has one; car and brand names stay Latin. */
  const titleOf = (p: Production) => (locale === "ar" ? (p.titleAr ?? p.title) : p.title);

  const rows = useMemo(() => productions.filter((p) => tabOf(p.type) === tab).sort(byYearDesc), [tab]);
  const duration = Math.max(45, rows.length * 3);
  const counts = useMemo(() => productions.reduce((acc, p) => { const k = tabOf(p.type); acc[k] = (acc[k] ?? 0) + 1; return acc; }, {} as Record<Tab, number>), []);

  const open = useCallback((p: Production) => {
    setTab(tabOf(p.type));
    setCurrent(p);
  }, []);
  const close = useCallback(() => setCurrent(null), []);

  // Other sections (credits ticker, garage) ask for a credit by id or brand.
  useEffect(() => {
    const onCredit = (e: Event) => {
      const d = (e as CustomEvent<CreditDetail>).detail ?? {};
      const p = d.id ? productions.find((x) => x.id === d.id) : d.brand ? findByBrand(d.brand) : undefined;
      if (p) open(p);
    };
    window.addEventListener("scenedrive:credit", onCredit);
    return () => window.removeEventListener("scenedrive:credit", onCredit);
  }, [open]);

  // Static list when the rows would not fill 70vh anyway.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const check = () => setShort(list.getBoundingClientRect().height < window.innerHeight * 0.7);
    const ro = new ResizeObserver(check);
    ro.observe(list);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [tab]);

  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab);
    // arrows follow the visual order, so they swap in the RTL edition
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const next =
      e.key === forward ? (i + 1) % TABS.length
      : e.key === backward ? (i - 1 + TABS.length) % TABS.length
      : e.key === "Home" ? 0
      : e.key === "End" ? TABS.length - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(TABS[next]);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  // Keyboard focus inside a clipped crawl is unreadable: expand to a plain list.
  const onCrawlFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    try {
      if ((e.target as Element).matches(":focus-visible")) setExpanded(true);
    } catch {}
  };

  const items: LightboxItem[] = useMemo(() => {
    if (!current) return [];
    return [
      ...(current.clips ?? []).map((src) => ({ kind: "video" as const, src })),
      ...(current.photos ?? []).map((src) => ({ kind: "image" as const, src })),
    ];
  }, [current]);

  const links = current
    ? [
        { label: f.links.page, href: `${locale === "ar" ? "/ar" : ""}/work/${current.id}` },
        ...(current.post ? [{ label: f.links.instagram, href: `https://www.instagram.com/p/${current.post}/` }] : []),
        ...(current.youtube ? [{ label: f.links.youtube, href: `https://www.youtube.com/watch?v=${current.youtube}` }] : []),
      ]
    : [];
  const subtitle = current ? [f.subtitle[current.type], current.year, current.cars].filter(Boolean).join(" · ") : undefined;

  const row = (p: Production) => (
    <li key={p.id} className={styles.item}>
      <button type="button" className={styles.row} onClick={() => open(p)} aria-haspopup="dialog">
        <span className={`num ${styles.year}`}>{p.year ?? "—"}</span>
        <span className={styles.titleCell}>
          {p.ramadan && (
            <span className={styles.moon} title={f.ramadan} aria-hidden="true">
              ☾
            </span>
          )}
          <span className={`display ${styles.title}`}>{titleOf(p)}</span>
          {p.ramadan && <span className="sr-only">{f.ramadan}</span>}
        </span>
        <span className={styles.cars}>{p.cars}</span>
        <span className={styles.talent}>{p.talent}</span>
      </button>
    </li>
  );

  const isStatic = expanded || short;

  return (
    <div className={styles.list}>
      <div className={styles.tabs}>
        <div role="tablist" aria-label={t.nav.credits} className={styles.tablist} onKeyDown={onTabKey}>
          {TABS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`filmography-tab-${id}`}
              aria-selected={tab === id}
              aria-controls="filmography-panel"
              tabIndex={tab === id ? 0 : -1}
              className={`${styles.tab} ${tab === id ? styles.tabOn : ""}`}
              onClick={() => setTab(id)}
            >
              <span>{f.tabs[id]}</span>
              <span className={`num ${styles.tabCount}`}>{String(counts[id]).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className={styles.aside}>
          <span className={styles.hint}>{f.hint}</span>
          <button type="button" className={styles.toggle} hidden={short} aria-pressed={expanded} onClick={() => setExpanded((v) => !v)}>
            {expanded ? f.showLess : f.showAll}
          </button>
        </div>
      </div>

      <div
        id="filmography-panel"
        role="tabpanel"
        aria-labelledby={`filmography-tab-${tab}`}
        className={styles.crawl}
        data-static={isStatic ? "true" : undefined}
        data-paused={current ? "true" : undefined}
        onFocus={onCrawlFocus}
        style={{ "--crawl-dur": `${duration}s` } as React.CSSProperties}
      >
        <div key={tab} className={styles.track}>
          <ul ref={listRef} className={styles.rows}>
            {rows.map(row)}
          </ul>
          <ul className={`${styles.rows} ${styles.dupe}`} aria-hidden="true" inert>
            {rows.map(row)}
          </ul>
        </div>
      </div>

      <Lightbox open={current !== null} onClose={close} title={current ? titleOf(current) : ""} subtitle={subtitle} items={items} links={links} />
    </div>
  );
}
