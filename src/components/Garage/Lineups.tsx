"use client";
import { fleet, lineups, type Car } from "@/data/fleet";
import { useT } from "@/i18n/LocaleProvider";
import { useCallSheet } from "@/lib/callsheet";
import { productionTitle } from "./titles";
import styles from "./Garage.module.css";

const byId = new Map(fleet.map((c) => [c.id, c] as const));

/** Ready-made lineups from past shoots, each on its own key art. One tap puts the whole set on the call sheet. */
export default function Lineups() {
  const { t, locale } = useT();
  const { has, add, remove } = useCallSheet();

  return (
    <div className={styles.lineups}>
      <div className={styles.lineupsHead}>
        <h3>{t.garage.lineupsTitle}</h3>
        <span className={styles.lineupsNote}>{t.garage.lineupsNote}</span>
      </div>
      <ul className={styles.panels} aria-label={t.garage.lineupsTitle}>
        {lineups.map((l, i) => {
          const cars = l.cars.map((id) => byId.get(id)).filter((c): c is Car => Boolean(c));
          const all = cars.length > 0 && cars.every((c) => has(c.id));
          const flip = () => cars.forEach((c) => (all ? remove(c.id) : add(c.id)));
          const title = t.garage.lineups[l.id] ?? l.title;
          return (
            <li key={l.id} className={styles.panel}>
              <picture>
                <source media="(max-width: 700px)" srcSet={`/media/art/${l.art}_m.jpg`} />
                <img src={`/media/art/${l.art}.jpg`} alt={`${title}: ${cars.map((c) => `${c.make} ${c.model}`).join(", ")}`} loading="lazy" decoding="async" className={styles.panelArt} />
              </picture>
              <div className={styles.panelShade} aria-hidden="true" />
              <div className={styles.panelBody}>
                <span className={styles.tileNo}>{t.garage.lineup} {String(i + 1).padStart(2, "0")} · {productionTitle(l.seenIn, locale)}</span>
                <h4 className={`display ${styles.panelTitle}`}>{title}</h4>
                <div className={styles.tileCars}>
                  {cars.map((c) => (
                    <span key={c.id} className="tag">{c.make} {c.model}</span>
                  ))}
                </div>
                <button type="button" className={`${styles.addAll} ${all ? styles.on : ""}`} aria-pressed={all} onClick={flip}>
                  {all ? t.garage.allAdded : `${t.garage.addAll} ${cars.length}`}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
