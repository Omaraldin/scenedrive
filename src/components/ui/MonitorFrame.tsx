import styles from "./MonitorFrame.module.css";

type Props = {
  children: React.ReactNode;
  /** HUD timecode text, e.g. "TC 00:00:41:12" */
  timecode?: string;
  cam?: string;
  tag?: string;
  className?: string;
  rec?: boolean;
};

/** On-set field-monitor chrome: REC dot, timecode, camera label. Wrap a <video> or <img>. */
export default function MonitorFrame({ children, timecode = "TC 00:00:00:00", cam = "A-CAM", tag = "Monitor · raw from set", className = "", rec = true }: Props) {
  return (
    <div className={`${styles.monitor} ${className}`}>
      {children}
      <div className={styles.hud} aria-hidden="true">
        {rec && <span className={styles.dot} />}
        {rec && <span>REC</span>}
        <span className="num">{timecode}</span>
        <span>{cam}</span>
      </div>
      <span className={styles.tag} aria-hidden="true">{tag}</span>
      <span className={styles.corner + " " + styles.tl} aria-hidden="true" />
      <span className={styles.corner + " " + styles.tr} aria-hidden="true" />
      <span className={styles.corner + " " + styles.bl} aria-hidden="true" />
      <span className={styles.corner + " " + styles.br} aria-hidden="true" />
    </div>
  );
}
