"use client";
import { useId, useState } from "react";
import MonitorFrame from "@/components/ui/MonitorFrame";
import VideoLoop from "@/components/ui/VideoLoop";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./Filmography.module.css";

type Clip = { src: string; poster?: string };

type Props = {
  /** phone footage from set, shown inside the monitor on the left */
  raw: Clip;
  /** finished film or ad clip, clean, on the right */
  final: Clip;
  caption: string;
  timecode?: string;
  cam?: string;
};

/** Raw-vs-final wipe. A full-size invisible range input drives the red slash divider, so it drags and takes arrow keys. */
export default function SplitCompare({ raw, final, caption, timecode = "TC 00:00:00:00", cam = "A-CAM" }: Props) {
  const { t, dir } = useT();
  const [pos, setPos] = useState(50);
  const captionId = useId();

  return (
    <figure className={styles.split} style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      {/* The wipe is measured from the left edge (clip-path, --pos, the range input), so the stage stays LTR in every edition.
          Only the labels inside it and the caption below follow the page direction. */}
      <div className={styles.stage} dir="ltr">
        <div className={styles.final}>
          <VideoLoop src={final.src} poster={final.poster} mode="inview" className={styles.video} />
          <span className={styles.finalLabel} dir={dir} aria-hidden="true">
            {t.filmography.finalCut}
          </span>
        </div>
        <div className={styles.raw}>
          <MonitorFrame className={styles.monitor} timecode={timecode} cam={cam} tag={t.lightbox.monitor}>
            <VideoLoop src={raw.src} poster={raw.poster} mode="inview" className={styles.video} />
          </MonitorFrame>
        </div>
        <span className="grain" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={styles.range}
          aria-label={t.filmography.wipeLabel}
          aria-valuetext={`${pos}%`}
          aria-describedby={captionId}
        />
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.grip}>◂▸</span>
        </div>
      </div>
      <figcaption id={captionId} className={styles.caption}>
        <span className={styles.captionKey}>{t.filmography.rawFinal}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
