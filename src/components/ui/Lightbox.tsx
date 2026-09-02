"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/LocaleProvider";
import styles from "./Lightbox.module.css";
import MonitorFrame from "./MonitorFrame";
import { mediaUrl } from "@/lib/media";

export type LightboxItem = { kind: "video" | "image"; src: string; label?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: LightboxItem[];
  /** optional link row, e.g. Instagram post / YouTube */
  links?: { label: string; href: string }[];
};

/** Monitor-framed dialog for a production or car: video with sound + photo strip. */
export default function Lightbox({ open, onClose, title, subtitle, items, links = [] }: Props) {
  const { t } = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); setI(0); }
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const cur = items[i];
  const clock = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? seconds : 0;
    const mins = Math.floor(safe / 60);
    const secs = Math.floor(safe % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <dialog ref={ref} className={styles.dialog} onClick={(e) => { if (e.target === ref.current) onClose(); }} aria-label={title}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <div className="eyebrow">{subtitle}</div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t.lightbox.close}>×</button>
        </header>
        {cur && (
          <MonitorFrame className={styles.stage} tag={cur.label ?? (cur.kind === "video" ? t.lightbox.monitor : t.lightbox.still)} rec={cur.kind === "video"} timecode={`${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`}>
            {cur.kind === "video" ? (
              <div className={styles.videoWrap}>
                <video
                  ref={videoRef}
                  key={cur.src}
                  src={mediaUrl(`v/${cur.src}`)}
                  autoPlay
                  muted={muted}
                  playsInline
                  className={styles.media}
                  onClick={togglePlayback}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                />
                <div className={styles.videoControls}>
                  <button type="button" className={styles.controlBtn} onClick={togglePlayback} aria-label={playing ? t.lightbox.pause : t.lightbox.play}>
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
                    }}
                    aria-label={t.lightbox.seek}
                  />
                  <span className={styles.time} dir="ltr">{clock(current)} / {clock(duration)}</span>
                  <button type="button" className={styles.sound} onClick={toggleSound} aria-label={muted ? t.lightbox.unmute : t.lightbox.mute}>
                    {muted ? t.lightbox.soundOff : t.lightbox.soundOn}
                  </button>
                </div>
              </div>
            ) : (
              <img key={cur.src} src={mediaUrl(`p/${cur.src}`, { w: 1600 })} alt={`${title} · ${t.lightbox.still}`} className={styles.media} />
            )}
          </MonitorFrame>
        )}
        {items.length > 1 && (
          <div className={styles.strip} role="tablist" aria-label={t.lightbox.media}>
            {items.map((it, k) => (
              <button type="button" key={it.src + k} role="tab" aria-selected={k === i} className={`${styles.thumb} ${k === i ? styles.on : ""}`} onClick={() => setI(k)}>
                {it.kind === "video" ? <img src={mediaUrl(`v/${it.src.replace(/\.mp4$/, ".jpg")}`, { w: 240 })} alt="" /> : <img src={mediaUrl(`t/${it.src}`, { w: 240 })} alt="" />}
                {it.kind === "video" && <span className={styles.play} aria-hidden="true">▶</span>}
              </button>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className={styles.links}>
            {links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="mono">{l.label} ↗</a>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
