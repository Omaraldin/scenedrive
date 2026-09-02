"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./Scenes.module.css";
import { mediaUrl } from "@/lib/media";

/**
 * Welad Rizk 2, the Hummer H2 desert take. BEFORE = the H2 on its wheels on the desert highway
 * (00:36 in the BTS cut); AFTER = frame 032 of the take sequence, the H2 settled on its side.
 */
const BEFORE = mediaUrl("p/h2_before.jpg");
const AFTER = mediaUrl("seq/h2_roll/032.webp");
/** Where the divider settles after the scroll-in cut. */
const REST = 50;

const RM = "(prefers-reduced-motion: reduce)";
function subscribeReduce(cb: () => void) {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduce = () => window.matchMedia(RM).matches;
const getReduceServer = () => false;

/**
 * Before/after of the two H2 frames. The control is a full-size <input type="range">
 * (keyboard, mouse, touch); a clapper-stick handle follows its value. Scrolling the block
 * into view cuts from the first frame to the second once; any input takes over.
 *
 * The stage is forced dir="ltr" in both editions: it is an image control, and the clip-path
 * that reveals the second frame is physical. Labels use logical insets and read in their own
 * direction (see .lab in the module css).
 */
export default function Compare() {
  const { t } = useT();
  const s = t.scenes;
  const rootRef = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const reduced = useSyncExternalStore(subscribeReduce, getReduce, getReduceServer);
  /** null until the tween or the visitor sets it; reduced motion skips the cut and rests at 50. */
  const [set, setV] = useState<number | null>(null);
  const v = set ?? (reduced ? REST : 100);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const o = { v: 100 };
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      once: true,
      onEnter: () => {
        tween.current = gsap.to(o, { v: REST, duration: 1.6, ease: "power4.out", onUpdate: () => setV(Math.round(o.v)) });
      },
    });
    return () => {
      st.kill();
      tween.current?.kill();
    };
  }, [reduced]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    tween.current?.kill();
    setV(Number(e.currentTarget.value));
  };

  return (
    <div className={styles.compareWrap}>
      <div ref={rootRef} className={styles.compare} dir="ltr" style={{ "--v": `${v}%` } as CSSProperties}>
        <img
          className={styles.before}
          src={BEFORE}
          alt={s.compareAltBefore}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <img
          className={styles.after}
          src={AFTER}
          alt={s.compareAltAfter}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className={`mono num ${styles.lab} ${styles.labStart}`}>{s.compareBefore}</span>
        <span className={`mono num ${styles.lab} ${styles.labEnd}`}>{s.compareAfter}</span>
        <input
          type="range"
          className={styles.range}
          min={0}
          max={100}
          step={1}
          value={v}
          onChange={onChange}
          aria-label={s.compareLabel}
          aria-valuetext={`${v}% ${s.compareBefore}, ${100 - v}% ${s.compareAfter}`}
        />
        <div className={styles.handle} aria-hidden="true">
          <span className={styles.line} />
          <span className={styles.grip}>
            <span className={styles.bar} />
            <span className={styles.bar} />
          </span>
        </div>
      </div>
      <p className={`mono ${styles.hint}`}>{s.compareHint}</p>
    </div>
  );
}
