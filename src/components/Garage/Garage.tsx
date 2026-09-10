import Eyebrow from "@/components/ui/Eyebrow";
import VideoLoop from "@/components/ui/VideoLoop";
import { fleet } from "@/data/fleet";
import type { Dictionary, Locale } from "@/i18n";
import GarageGrid from "./GarageGrid";
import styles from "./Garage.module.css";

const OPENER_ID = "porsche-718-boxster";
const openerCar = fleet.find((c) => c.id === OPENER_ID);
const openerBay = String(fleet.findIndex((c) => c.id === OPENER_ID) + 1).padStart(2, "0");

type Props = { locale: Locale; t: Dictionary };

/** The garage: opener loop, bay-card grid, lineups. Server shell; interaction lives in GarageGrid (client, useT). */
export default function Garage({ t }: Props) {
  const openerName = openerCar ? `${openerCar.make} ${openerCar.model}` : t.nav.garage;
  return (
    <section id="garage" className="section">
      <div className="wrap">
        <header className={styles.head}>
          <Eyebrow>{t.garage.eyebrow}</Eyebrow>
          <h2>{t.garage.title}</h2>
          <p className="lead">{t.garage.lead}</p>
        </header>

        <div className={styles.opener}>
          <VideoLoop
            src="loop/garage_porsche718.mp4"
            poster="loop/garage_porsche718.jpg"
            mode="inview"
            className={styles.openerVideo}
            alt={openerName}
          />
          <div className="grain" aria-hidden="true" />
          <div className={styles.openerHud} aria-hidden="true">
            <span>
              {t.garage.openerBay} {openerBay} · <b>{openerName}</b>
            </span>
            <span>{t.garage.openerNote}</span>
          </div>
        </div>

        <GarageGrid />
      </div>
    </section>
  );
}
