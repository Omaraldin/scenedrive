"use client";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { fleet, categories, type Car, type Category } from "@/data/fleet";
import type { Dictionary } from "@/i18n";
import { useT } from "@/i18n/LocaleProvider";
import Lightbox, { type LightboxItem } from "@/components/ui/Lightbox";
import BayCard from "./BayCard";
import Lineups from "./Lineups";
import styles from "./Garage.module.css";

type Filter = Category | "all";
type Sort = "make" | "az";

type PreviewMode = "hover" | "inview" | "none";

/* Desktop previews on hover. Touch previews play only while a card is centered in the viewport.
   Reduced-motion users keep the still image and do not download reels. */
const HOVER_MQ = "(hover: hover) and (pointer: fine)";
const REDUCE_MQ = "(prefers-reduced-motion: reduce)";
function subscribeReels(cb: () => void) {
  const mqs = [window.matchMedia(HOVER_MQ), window.matchMedia(REDUCE_MQ)];
  mqs.forEach((mq) => mq.addEventListener("change", cb));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", cb));
}
const getPreviewMode = (): PreviewMode => {
  if (window.matchMedia(REDUCE_MQ).matches) return "none";
  return window.matchMedia(HOVER_MQ).matches ? "hover" : "inview";
};
const getPreviewModeServer = (): PreviewMode => "none";

/* Per-category counts for the bay signage. */
const counts: Record<Filter, number> = { all: fleet.length, supercar: 0, sports: 0, luxury: 0, suv: 0, classic: 0 };
for (const car of fleet) counts[car.category] += 1;

/** Reel first, then the SceneDrive card and the on-set still (deduped). */
function lightboxItems(car: Car, t: Dictionary): LightboxItem[] {
  const items: LightboxItem[] = [];
  if (car.reel) items.push({ kind: "video", src: car.reel, label: t.lightbox.monitor });
  const stills = Array.from(new Set([car.card, car.photo].filter((s): s is string => Boolean(s))));
  for (const src of stills) items.push({ kind: "image", src, label: src === car.card ? t.brand.name : t.lightbox.still });
  return items;
}

export default function GarageGrid() {
  const { t } = useT();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("make");
  const [active, setActive] = useState<Car | null>(null);
  const previewMode = useSyncExternalStore(subscribeReels, getPreviewMode, getPreviewModeServer);

  const cars = useMemo(() => {
    const list = filter === "all" ? fleet : fleet.filter((c) => c.category === filter);
    if (sort === "az") return [...list].sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`));
    return list; // "make": the garage's own order, grouped by make
  }, [filter, sort]);

  const open = useCallback((car: Car) => setActive(car), []);
  const close = useCallback(() => setActive(null), []);

  // Deep link: /?car=<id> opens that car's details and lands on its bay.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("car");
    if (!id) return;
    const car = fleet.find((c) => c.id === id);
    if (!car) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(`car-${car.id}`)?.scrollIntoView({ block: "center" });
      setActive(car);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.chips} role="group" aria-label={t.nav.garage}>
          {categories.map((cat) => {
            const on = filter === cat.id;
            return (
              <button key={cat.id} type="button" className={`${styles.sign} ${on ? styles.on : ""}`} aria-pressed={on} onClick={() => setFilter(cat.id)}>
                {t.garage.filters[cat.id]} <span className={`${styles.n} num`}>{counts[cat.id]}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.tools}>
          <span className={`${styles.count} num`} aria-live="polite">{cars.length} {t.garage.count}</span>
          <div className={styles.sort} role="group" aria-label={`${t.garage.sort.byMake} / ${t.garage.sort.az}`}>
            <button type="button" className={`${styles.sortBtn} ${sort === "make" ? styles.on : ""}`} aria-pressed={sort === "make"} onClick={() => setSort("make")}>{t.garage.sort.byMake}</button>
            <button type="button" className={`${styles.sortBtn} ${sort === "az" ? styles.on : ""}`} aria-pressed={sort === "az"} onClick={() => setSort("az")}>{t.garage.sort.az}</button>
          </div>
        </div>
      </div>

      <ul className={styles.grid} aria-label={t.garage.count}>
        {cars.map((car) => (
          <BayCard key={car.id} car={car} previewMode={previewMode} onDetails={open} />
        ))}
      </ul>

      <Lineups />

      <Lightbox
        open={active !== null}
        onClose={close}
        title={active ? active.model : ""}
        subtitle={active?.make ?? t.garage.lightboxSubtitle}
        items={active ? lightboxItems(active, t) : []}
      />
    </>
  );
}
