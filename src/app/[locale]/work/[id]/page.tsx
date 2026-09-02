import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import SlashButton from "@/components/ui/SlashButton";
import VideoLoop from "@/components/ui/VideoLoop";
import Player from "@/components/ui/Player";
import { productions } from "@/data/productions";
import { fleet } from "@/data/fleet";
import { site, whatsappLink } from "@/data/site";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n";
import { mediaUrl } from "@/lib/media";
import styles from "./work.module.css";

type Params = { locale: string; id: string };

export function generateStaticParams() {
  return locales.flatMap((locale) => productions.map((p) => ({ locale, id: p.id })));
}

function titleOf(p: (typeof productions)[number], locale: Locale) {
  return locale === "ar" ? p.titleAr ?? p.title : p.title;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, id } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const p = productions.find((x) => x.id === id);
  if (!p) return {};
  const t = getDictionary(loc);
  const title = `${titleOf(p, loc)} · ${site.nameFull}`;
  const description = `${t.work.types[p.type]}${p.year ? ` · ${p.year}` : ""} · ${p.cars}${p.talent ? ` · ${p.talent}` : ""}`;
  const cover = p.photos?.[0] ? mediaUrl(`p/${p.photos[0]}`, { w: 1200 }) : p.clips?.[0] ? mediaUrl(`v/${p.clips[0].replace(/\.mp4$/, ".jpg")}`, { w: 1200 }) : "/og.jpg";
  const path = `${loc === "ar" ? "/ar" : ""}/work/${p.id}`;
  return {
    title, description,
    alternates: { canonical: path, languages: { en: `/work/${p.id}`, ar: `/ar/work/${p.id}` } },
    openGraph: { title, description, images: [cover], type: "article", locale: loc === "ar" ? "ar_EG" : "en_US" },
  };
}

/** One page per credit: cover, facts, every clip and still, the cars in the garage, a prefilled booking. */
export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { locale, id } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = getDictionary(loc);
  const p = productions.find((x) => x.id === id);
  if (!p) notFound();
  const title = titleOf(p, loc);
  const prefix = loc === "ar" ? "/ar" : "";
  const clips = p.clips ?? [];
  const photos = p.photos ?? [];
  const cover = clips[0];
  // cars named in this credit, matched loosely against the garage
  const carsHere = fleet.filter((c) => p.cars.toLowerCase().includes(c.model.toLowerCase()) || c.seenIn.some((s) => p.title.includes(s) || s.includes(p.title)));
  const others = productions.filter((x) => x.id !== p.id && x.type === p.type).slice(0, 6);
  const cta = whatsappLink(t.work.ctaMessage.replace("{title}", p.title));

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.hero}>
          {cover ? (
            <VideoLoop src={`v/${cover}`} poster={`v/${cover.replace(/\.mp4$/, ".jpg")}`} mode="inview" className={styles.cover} alt={title} />
          ) : photos[0] ? (
            <img src={mediaUrl(`p/${photos[0]}`, { w: 1920 })} alt={title} className={styles.cover} />
          ) : null}
          <div className={styles.shade} aria-hidden="true" />
          <div className={`wrap ${styles.heroInner}`}>
            <a href={`${prefix}/#filmography`} className={`mono ${styles.back}`}>← {t.work.back}</a>
            <div className="eyebrow">{t.work.eyebrow} · {t.work.types[p.type]}{p.year ? ` · ${p.year}` : ""}{p.ramadan ? ` · ${t.filmography.ramadan}` : ""}</div>
            <h1 className={styles.title}>{title}</h1>
            {p.logo && <img src={`/partners/out/${p.logo}`} alt="" className={styles.logo} loading="lazy" />}
          </div>
        </header>

        <section className={`section ${styles.facts}`}>
          <div className={`wrap ${styles.factsGrid}`}>
            <div><span className={styles.k}>{t.work.cars}</span><p className={styles.v}>{p.cars}</p></div>
            {p.talent && <div><span className={styles.k}>{t.work.talent}</span><p className={styles.v}>{p.talent}</p></div>}
            {p.year && <div><span className={styles.k}>{t.work.year}</span><p className={`${styles.v} num`}>{p.year}</p></div>}
            <div className={styles.ctaCol}>
              <SlashButton href={cta} external>{t.work.cta}</SlashButton>
              <div className={styles.links}>
                {p.youtube && <a className="mono" href={`https://www.youtube.com/watch?v=${p.youtube}`} target="_blank" rel="noopener noreferrer">{t.filmography.links.youtube} ↗</a>}
                {p.post && <a className="mono" href={`https://www.instagram.com/p/${p.post}/`} target="_blank" rel="noopener noreferrer">{t.filmography.links.instagram} ↗</a>}
              </div>
            </div>
          </div>
        </section>

        {clips.length > 0 && (
          <section className="section">
            <div className="wrap">
              <div className="eyebrow">{t.work.watch}</div>
              <div className={styles.clips}>
                {clips.map((c, k) => (
                  <Player key={c} src={c} poster={`v/${c.replace(/\.mp4$/, ".jpg")}`} tag={`${title} · ${String(k + 1).padStart(2, "0")}`} label={`${title} ${k + 1}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        {photos.length > 0 && (
          <section className="section">
            <div className="wrap">
              <div className="eyebrow">{t.work.stills}</div>
              <div className={styles.stills}>
                {photos.map((ph) => (
                  <img key={ph} src={mediaUrl(`p/${ph}`, { w: 1200 })} alt={`${title} · ${t.work.stills}`} loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
          </section>
        )}

        {carsHere.length > 0 && (
          <section className="section">
            <div className="wrap">
              <div className="eyebrow">{t.work.inGarage}</div>
              <ul className={styles.cars}>
                {carsHere.map((c) => (
                  <li key={c.id}>
                    <a href={`${prefix}/?car=${c.id}#garage`} className={styles.car}>
                      {(c.card || c.photo) && <img src={mediaUrl(`t/${c.card ?? c.photo}`, { w: 480 })} alt={`${c.make} ${c.model}`} loading="lazy" />}
                      <span className="mono">{c.make}</span>
                      <b className="display">{c.model}</b>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="section">
            <div className="wrap">
              <div className="eyebrow">{t.work.more}</div>
              <ul className={styles.more}>
                {others.map((o) => (
                  <li key={o.id}>
                    <a href={`${prefix}/work/${o.id}`} className={styles.moreLink}>
                      <span className="mono num">{o.year ?? "—"}</span>
                      <b className="display">{titleOf(o, loc)}</b>
                      <span className={`mono ${styles.moreCars}`}>{o.cars}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer locale={loc} t={t} />
    </>
  );
}
