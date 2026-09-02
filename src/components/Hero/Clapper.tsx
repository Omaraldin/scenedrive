import styles from "./Hero.module.css";
import type { Dictionary } from "@/i18n";

/** Film slate. `closed` rotates the top stick down (the clap). */
export default function Clapper({ closed, t }: { closed: boolean; t: Dictionary }) {
  const s = t.hero.slate;
  return (
    <div className={`${styles.clapper} ${closed ? styles.clapped : ""}`} aria-hidden="true">
      <div className={styles.stickTop}>
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className={styles.stickBottom}>
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className={styles.board}>
        <div className={styles.row}><b>{s.prod}</b><span>{s.production}</span></div>
        <div className={styles.row}><b>{s.scene}</b><span className="num">01</span><b>{s.take}</b><span className="num">1</span></div>
        <div className={styles.row}><b>{s.cars}</b><span>{s.supplier}</span></div>
        <div className={styles.row}><b>{s.dir}</b><span>{s.director}</span><b>{s.cam}</b><span>EG</span></div>
      </div>
    </div>
  );
}
