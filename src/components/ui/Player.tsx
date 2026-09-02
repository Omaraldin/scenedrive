"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import { mediaUrl } from "@/lib/media";
import MonitorFrame from "./MonitorFrame";
import styles from "./Player.module.css";

type Props = {
  /** file under /media/v */
  src: string;
  poster?: string;
  tag?: string;
  autoPlay?: boolean;
  /** start muted (autoplaying players must) */
  muted?: boolean;
  className?: string;
  label?: string;
};

function clock(s: number) {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/** SceneDrive video player: monitor chrome, transport only while the pointer is over it (or after a tap on touch). */
export default function Player({ src, poster, tag, autoPlay = false, muted: startMuted = autoPlay, className = "", label }: Props) {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(startMuted);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [awake, setAwake] = useState(false);

  const wake = () => {
    setAwake(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setAwake(false), 2200);
  };
  const sleep = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setAwake(false);
  };
  useEffect(() => () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
    wake();
  };
  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    wake();
  };
  const fullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    const el = v.parentElement?.parentElement ?? v;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
    wake();
  };

  const tc = `TC ${clock(current)}:${String(Math.floor((current % 1) * 24)).padStart(2, "0")}`;
  const show = awake;

  return (
    <MonitorFrame className={`${styles.frame} ${className}`} tag={tag ?? t.lightbox.monitor} timecode={tc} rec={playing}>
      <div
        className={`${styles.wrap} ${show ? styles.awake : ""}`}
        onPointerMove={wake}
        onPointerEnter={wake}
        onPointerLeave={sleep}
        onTouchStart={wake}
      >
        <video
          ref={videoRef}
          src={mediaUrl(`v/${src}`)}
          poster={poster ? mediaUrl(poster, { w: 1280 }) : undefined}
          autoPlay={autoPlay}
          muted={muted}
          playsInline
          preload={autoPlay ? "auto" : "metadata"}
          className={styles.video}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          aria-label={label}
        />
        {!playing && (
          <button type="button" className={styles.big} onClick={toggle} aria-label={t.lightbox.play}>
            <span aria-hidden="true">▶</span>
          </button>
        )}
        <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
          <button type="button" className={styles.btn} onClick={toggle} aria-label={playing ? t.lightbox.pause : t.lightbox.play}>
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
          </button>
          <input
            className={styles.timeline}
            type="range"
            min="0"
            max={duration || 0}
            step="0.05"
            value={Math.min(current, duration || 0)}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (videoRef.current) videoRef.current.currentTime = next;
              setCurrent(next);
              wake();
            }}
            aria-label={t.lightbox.seek}
          />
          <span className={`num ${styles.time}`} dir="ltr">{clock(current)} / {clock(duration)}</span>
          <button type="button" className={styles.btn} onClick={toggleSound} aria-label={muted ? t.lightbox.unmute : t.lightbox.mute}>
            <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
          </button>
          <button type="button" className={styles.btn} onClick={fullscreen} aria-label="Fullscreen">
            <span aria-hidden="true">⛶</span>
          </button>
        </div>
      </div>
    </MonitorFrame>
  );
}
