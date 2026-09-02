"use client";
import { useEffect, useRef, useState } from "react";
import SlashButton from "@/components/ui/SlashButton";
import { whatsappLink } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { useCallSheet } from "@/lib/callsheet";
import styles from "./Nav.module.css";

/** Bar turns solid once the hero has scrolled this far. */
const SOLID_AT = 80;
/** Ignore scroll jitter smaller than this before flipping hide/reveal. */
const DELTA = 6;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Fixed top bar: transparent over the hero, ink after 80px, tucks away on scroll down and returns on scroll up. */
export default function Nav() {
  const { t } = useT();
  const { cars } = useCallSheet();
  const count = cars.length;
  const [solid, setSolid] = useState(false);
  const [tucked, setTucked] = useState(false);
  const prevCount = useRef(count);

  const links = [
    { id: "garage", label: t.nav.garage },
    { id: "scenes", label: t.nav.scenes },
    { id: "filmography", label: t.nav.credits },
    { id: "book", label: t.nav.book },
  ];
  const bookHref = whatsappLink(t.hero.bookMessage);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > SOLID_AT);
      if (y <= SOLID_AT) {
        setTucked(false);
        last = y;
        return;
      }
      const d = y - last;
      if (Math.abs(d) < DELTA) return; // let slow drift accumulate
      setTucked(d > 0);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // A car added while the bar is tucked away: bring it back so the count is seen.
  useEffect(() => {
    if (count > prevCount.current) setTucked(false);
    prevCount.current = count;
  }, [count]);

  return (
    <header className={`${styles.nav} ${solid ? styles.solid : ""} ${tucked ? styles.tucked : ""}`}>
      <div className={`wrap ${styles.inner}`}>
        <a
          href="#top"
          className={styles.brand}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className={`display slash ${styles.wordmark}`}>{t.brand.name}</span>
        </a>

        <nav className={styles.links} aria-label={t.footer.links}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(l.id);
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          {count > 0 && (
            <button
              type="button"
              className={`${styles.pill} num`}
              onClick={() => scrollToId("book")}
              aria-label={`${t.nav.callSheet} · ${count} · ${t.nav.book}`}
            >
              <span className={styles.pillLabel}>
                {t.nav.callSheet}
                <span aria-hidden="true"> · </span>
              </span>
              {count}
            </button>
          )}
          <a href={t.nav.switchHref} hrefLang={t.nav.switchLang} lang={t.nav.switchLang} className={styles.lang}>
            {t.nav.switchTo}
          </a>
          <SlashButton href={bookHref} external className={styles.cta}>
            <span className={styles.ctaLong}>{t.nav.whatsapp}</span>
            <span className={styles.ctaShort}>{t.nav.whatsappShort}</span>
          </SlashButton>
        </div>
      </div>
    </header>
  );
}
