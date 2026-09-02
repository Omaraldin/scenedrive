import type { Dictionary, Locale } from "@/i18n";
import Eyebrow from "@/components/ui/Eyebrow";
import MonitorFrame from "@/components/ui/MonitorFrame";
import SlashButton from "@/components/ui/SlashButton";
import VideoLoop from "@/components/ui/VideoLoop";
import { whatsappLink } from "@/data/site";
import Compare from "./Compare";
import styles from "./Scenes.module.css";

type Props = { locale: Locale; t: Dictionary };

/** Any scene: before/after of the H2 desert take, the G-Class showroom scene, and what the unit covers. */
export default function Scenes({ t }: Props) {
  const s = t.scenes;
  const planHref = whatsappLink(s.ctaMessage);

  return (
    <section id="scenes" className={`section ${styles.scenes}`}>
      <div className={styles.slashBg} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <header className={styles.head}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2>{s.title}</h2>
          <p className="lead">{s.lead}</p>
        </header>

        <div className={styles.cols}>
          <Compare />

          <div className={styles.monitors}>
            <MonitorFrame className={styles.fire} timecode="TC 00:00:09:00" tag={s.monitorFire}>
              <VideoLoop src="loop/wr3_fire.mp4" poster="loop/wr3_fire.jpg" mode="inview" alt={s.monitorFire} />
            </MonitorFrame>
            <div className={styles.sub}>
              <div className={styles.subNote}>
                <span className="tag tag--real">{s.real}</span>
                <span>{s.monitorNote}</span>
              </div>
              <MonitorFrame className={styles.slide} timecode="TC 00:00:38:04" cam="PHONE" tag={s.monitorSlide}>
                <VideoLoop src="loop/h2_slide_bts.mp4" poster="loop/h2_slide_bts.jpg" mode="inview" alt={s.monitorSlide} />
              </MonitorFrame>
            </div>
          </div>
        </div>

        <ul className={styles.covers}>
          {s.covers.map((c, i) => (
            <li key={c.title} className={styles.cover}>
              <span className={`mono num ${styles.idx}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>

        <div className={styles.foot}>
          <div className={styles.cta}>
            <SlashButton href={planHref} external>{s.cta}</SlashButton>
            <span className={`mono ${styles.note}`}>{s.ctaNote}</span>
          </div>
          <p className={`mono ${styles.credit}`}>{s.credit}</p>
        </div>
      </div>
    </section>
  );
}
