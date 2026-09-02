import { site } from "@/data/site";
import type { Dictionary, Locale } from "@/i18n";
import styles from "./Footer.module.css";

type Props = { locale: Locale; t: Dictionary };

/** Site footer: wordmark, contact lines, section links, language switch, rights line. */
export default function Footer({ t }: Props) {
  const links = [
    { id: "garage", label: t.nav.garage },
    { id: "scenes", label: t.nav.scenes },
    { id: "filmography", label: t.nav.credits },
    { id: "book", label: t.nav.book },
  ];

  return (
    <footer id="footer" className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={`display slash ${styles.wordmark}`}>{t.brand.name}</span>
          <p className={styles.tagline}>{t.brand.tagline}</p>
        </div>

        <div className={styles.col}>
          <span className={styles.colHead}>{t.footer.contact}</span>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            <span className="num" dir="ltr">{site.phoneDisplay}</span> · {t.nav.whatsappShort}
          </a>
          <a href={`mailto:${site.email}`} dir="ltr">{site.email}</a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" dir="ltr">
            {site.instagramHandle}
          </a>
          <span className={styles.plain}>{t.footer.nationwide}</span>
        </div>

        <nav className={styles.col} aria-labelledby="footer-sections">
          <span id="footer-sections" className={styles.colHead}>{t.footer.links}</span>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
          <a href={t.nav.switchHref} hrefLang={t.nav.switchLang} lang={t.nav.switchLang} className={styles.lang}>
            {t.nav.switchTo}
          </a>
        </nav>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <span>{t.footer.legal}</span>
        <span className="num">
          {t.credits.stats.since.label} {t.brand.since}
        </span>
      </div>
    </footer>
  );
}
