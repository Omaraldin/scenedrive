"use client";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import type { Car } from "@/data/fleet";
import { useT } from "@/i18n/LocaleProvider";
import { useCallSheet } from "@/lib/callsheet";
import SlashButton from "@/components/ui/SlashButton";
import VideoLoop from "@/components/ui/VideoLoop";
import { productionTitle } from "./titles";
import styles from "./Garage.module.css";
import { mediaUrl } from "@/lib/media";

type Props = {
  car: Car;
  previewMode: "hover" | "inview" | "none";
  onDetails: (car: Car) => void;
};

/** "cold": reel never requested. "on": card hovered or focused, reel plays. "off": reel mounted, paused. */
type Reel = "cold" | "on" | "off";

/** One bay: still (card > photo > plate), reel on hover, make/model/role/credits, Details + call-sheet toggle. */
export default function BayCard({ car, previewMode, onDetails }: Props) {
  const { t, locale } = useT();
  const { has, toggle } = useCallSheet();
  const on = has(car.id);

  // The reel is fetched on the first hover/focus only, never on scroll proximity. Once fetched it stays
  // mounted and paused (`active=false` → preload="metadata"), so the second hover is instant.
  const [reel, setReel] = useState<Reel>("cold");
  const [reelReady, setReelReady] = useState(false);
  const cardRef = useRef<HTMLLIElement>(null);
  const enter = () => setReel("on");
  const leave = () => setReel("off");
  const blur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave();
  };
  const showReel = previewMode !== "none" && Boolean(car.reel) && reel !== "cold";

  useEffect(() => {
    const card = cardRef.current;
    if (!card || previewMode !== "inview" || !car.reel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setReel(entry.isIntersecting ? "on" : "off"),
      { threshold: 0.6 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [car.reel, previewMode]);

  const still = car.card ?? car.photo;
  const poster = car.reel ? car.reel.replace(/\.mp4$/, ".jpg") : undefined;
  const titleId = `car-${car.id}-title`;
  const name = `${car.make} ${car.model}`;
  const role = t.garage.roles[car.id] ?? car.role;

  return (
    <li
      ref={cardRef}
      id={`car-${car.id}`}
      className={styles.card}
      aria-labelledby={titleId}
      data-hover-scope
      onPointerEnter={previewMode === "hover" ? enter : undefined}
      onPointerLeave={previewMode === "hover" ? leave : undefined}
      onFocus={previewMode === "hover" ? enter : undefined}
      onBlur={previewMode === "hover" ? blur : undefined}
    >
      <div className={styles.media}>
        {still ? (
          <img src={mediaUrl(`t/${still}`, { w: 480 })} alt={name} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.plate} aria-hidden="true">
            <span className={styles.plateMake}>{car.make}</span>
            <span className={`display ${styles.plateModel}`}>{car.model}</span>
          </div>
        )}
        {showReel && (
          // `active` drives play/pause from the card's own hover state: VideoLoop's hover listeners would only
          // attach after the pointerenter that mounted it, so the first hover would sit on the poster.
          <VideoLoop
            mode="manual"
            active={reel === "on"}
            src={`v/${car.reel}`}
            poster={`v/${poster}`}
            className={`${styles.reel} ${reel === "on" ? styles.reelOn : ""}`}
            onCanPlay={() => setReelReady(true)}
            onWaiting={() => setReelReady(false)}
          />
        )}
        {showReel && reel === "on" && !reelReady && (
          <div className={styles.reelLoading} role="status" aria-label={t.garage.loadingPreview}>
            <span />
            <b>{t.garage.loadingPreview}</b>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.make}>
          <span>{car.make}</span>
        </div>
        <h3 id={titleId} className={styles.model}>{car.model}</h3>
        <p className={styles.role}>{role}</p>
        {car.seenIn.length > 0 && (
          <p className={styles.seen}>
            {t.garage.seenIn} · {car.seenIn.map((s) => productionTitle(s, locale)).join(" · ")}
          </p>
        )}
        <div className={styles.controls}>
          <SlashButton variant="ghost" className={styles.details} onClick={() => onDetails(car)}>
            {t.garage.details}
          </SlashButton>
          <button
            type="button"
            className={`${styles.toggle} ${on ? styles.on : ""}`}
            aria-pressed={on}
            onClick={() => toggle(car.id)}
          >
            {on ? t.garage.added : t.garage.add}
          </button>
        </div>
      </div>
    </li>
  );
}
