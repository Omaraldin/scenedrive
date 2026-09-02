"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import { getBeats, ROLL_FRAMES, beatAt, timecode } from "./beats";
import Clapper from "./Clapper";
import MonitorFrame from "@/components/ui/MonitorFrame";
import SlashButton from "@/components/ui/SlashButton";
import { site, whatsappLink } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { mediaUrl } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

const RM = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduce = () => window.matchMedia(RM).matches;
const getReduceServer = () => false;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const { t } = useT();
  const BEATS = useMemo(() => getBeats(t), [t]);
  const ROLL_INDEX = BEATS.findIndex((b) => b.source === "seq");
  const TITLE_INDEX = BEATS.length - 1;
  const bookHref = whatsappLink(t.hero.bookMessage);

  const trackRef = useRef<HTMLDivElement>(null);
  const screenRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const monitorRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef(-1);

  const [beat, setBeat] = useState(0);
  const [clapped, setClapped] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduce, getReduce, getReduceServer);
  const [warmRoll, setWarmRoll] = useState(false);
  const [loadedThrough, setLoadedThrough] = useState(1);
  const beatRef = useRef(0);

  // Preload the H2 take frames once the visitor is a couple of beats away.
  useEffect(() => {
    if (!warmRoll || framesRef.current.length) return;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= ROLL_FRAMES; i++) {
      const im = new Image();
      im.decoding = "async";
      im.src = mediaUrl(`seq/h2_roll/${String(i).padStart(3, "0")}.webp`);
      imgs.push(im);
    }
    framesRef.current = imgs;
  }, [warmRoll]);

  const drawFrame = useCallback((t: number) => {
    const cv = canvasRef.current;
    const imgs = framesRef.current;
    if (!cv || !imgs.length) return;
    const idx = Math.min(ROLL_FRAMES - 1, Math.max(0, Math.round(t * (ROLL_FRAMES - 1))));
    if (idx === lastDrawn.current) return;
    const im = imgs[idx];
    if (!im.complete || !im.naturalWidth) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = cv.width, H = cv.height;
    // cover
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
    lastDrawn.current = idx;
    if (frameRef.current) frameRef.current.textContent = `FR ${String(idx + 1).padStart(3, "0")}/${ROLL_FRAMES}`;
  }, []);

  // Size the canvas to the viewport (device pixels capped for perf).
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(window.innerWidth * dpr);
      cv.height = Math.round(window.innerHeight * dpr);
      lastDrawn.current = -1;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Play only the active layers.
  useEffect(() => {
    screenRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === beat && !reduced) v.play().catch(() => {});
      else v.pause();
    });
    monitorRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === beat && !reduced) v.play().catch(() => {});
      else v.pause();
    });
  }, [beat, reduced]);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const { index, t } = beatAt(p);
        if (index !== beatRef.current) {
          beatRef.current = index;
          setBeat(index);
          // Warm the next cut while retaining clips already requested.
          setLoadedThrough((loaded) => Math.max(loaded, index + 1));
          // a two-frame white flash on every cut
          const fl = flashRef.current;
          if (fl && index > 0) {
            fl.style.opacity = "0.9";
            requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.opacity = "0"; }));
          }
        }
        if (p > 0.015) setClapped(true);
        if (p > 0.3) setWarmRoll(true);
        if (tcRef.current) tcRef.current.textContent = timecode(p);
        if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${p})`;
        // virtual camera push on the active screen layer
        const v = screenRefs.current[index];
        if (v) v.style.transform = `scale(${(1 + t * 0.08).toFixed(4)})`;
        if (index === ROLL_INDEX) drawFrame(t);
      },
    });
    return () => st.kill();
  }, [drawFrame, reduced, ROLL_INDEX]);

  const current = BEATS[beat];
  const isTitle = beat === TITLE_INDEX;
  const rail = useMemo(() => BEATS.map((b) => ({ id: b.id, label: b.label, from: b.from })), [BEATS]);

  const jumpTo = (from: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const h = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + h * (from + 0.01), behavior: "smooth" });
  };

  const sourceTag =
    current.source === "seq" ? t.hero.hud.scrubbed
    : current.source === "real" || current.source === "ai" ? t.hero.hud.footage
    : t.hero.hud.slate;

  if (reduced) {
    return (
      <section id="hero" className={styles.static}>
        <img src="/media/art/heist.jpg" alt={`${t.hero.beats.title.title} · ${t.hero.beats.wide.sub}`} className={styles.staticImg} />
        <div className={styles.staticInner}>
          <div className="eyebrow">{t.hero.eyebrow}</div>
          <h1 className="slash">{t.brand.name}</h1>
          <p className="lead">{t.brand.tagline}. {t.hero.beats.chase.title}</p>
          <div className={styles.ctas}>
            <SlashButton href={bookHref} external>{t.hero.ctaBook}</SlashButton>
            <SlashButton variant="ghost" onClick={() => scrollToId("garage")}>{t.hero.ctaGarage}</SlashButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className={styles.track} ref={trackRef} aria-label={t.brand.name}>
      <div className={styles.stage}>
        {/* screen layers */}
        <div className={styles.screen}>
          {BEATS.map((b, i) => {
            const shouldLoad = i <= loadedThrough;
            return b.screen ? (
              <video
                key={b.id}
                ref={(el) => { screenRefs.current[i] = el; }}
                className={`${styles.layer} ${i === beat ? styles.on : ""}`}
                src={shouldLoad ? mediaUrl(`loop/${b.screen}.mp4`) : undefined}
                poster={mediaUrl(`loop/${b.screen}.jpg`)}
                muted
                loop
                playsInline
                preload={shouldLoad ? "auto" : "none"}
                disablePictureInPicture
                aria-hidden="true"
              />
            ) : null;
          })}
          {BEATS.map((b, i) =>
            b.image ? (
              <img key={b.id + "-img"} src={mediaUrl(b.image)} alt="" className={`${styles.layer} ${styles.art} ${i === beat ? styles.on : ""}`} aria-hidden="true" />
            ) : null
          )}
          <canvas ref={canvasRef} className={`${styles.layer} ${styles.canvas} ${beat === ROLL_INDEX ? styles.on : ""}`} aria-hidden="true" />
          <div className={`${styles.layer} ${styles.black} ${beat === 0 ? styles.on : ""}`} aria-hidden="true" />
          <div className="grain" />
          <div ref={flashRef} className={styles.flash} aria-hidden="true" />
        </div>

        {/* letterbox */}
        <div className={`${styles.bar} ${styles.barTop}`} aria-hidden="true" />
        <div className={`${styles.bar} ${styles.barBottom}`} aria-hidden="true" />

        {/* HUD */}
        <div className={styles.hud} aria-hidden="true">
          <span className={styles.rec} />
          <span>{t.hero.hud.rec}</span>
          <span ref={tcRef} className="num">{timecode(0)}</span>
          <span>{t.hero.hud.cam}</span>
          <span ref={frameRef} className={`num ${styles.frameCounter} ${beat === ROLL_INDEX ? styles.show : ""}`}>{`FR 001/${String(ROLL_FRAMES).padStart(3, "0")}`}</span>
        </div>
        <div className={styles.hudEnd} aria-hidden="true">
          <span>{t.hero.hud.scene}</span>
          <span className={`tag ${current.source === "seq" || current.source === "real" || current.source === "ai" ? "tag--real" : ""}`}>
            {sourceTag}
          </span>
        </div>

        {/* slate */}
        <div className={`${styles.slate} ${beat === 0 ? styles.slateOn : ""}`}>
          <div className={styles.bigmark} aria-hidden="true">{t.brand.name}</div>
          <Clapper closed={clapped} t={t} />
          <p className={styles.slateSub}>{t.brand.tagline}</p>
          <div className={styles.hint} aria-hidden="true"><span>{t.hero.slate.hint}</span><i /></div>
        </div>

        {/* monitor */}
        <div className={`${styles.monitorWrap} ${current.monitor ? styles.monitorOn : ""}`}>
          <MonitorFrame tag={current.monitorTag ?? t.hero.monitorDefault} timecode={`${t.hero.hud.cam} · RAW`} cam="" className={styles.monitor}>
            {BEATS.map((b, i) => {
              const shouldLoad = i <= loadedThrough;
              return b.monitor ? (
                <video
                  key={b.id}
                  ref={(el) => { monitorRefs.current[i] = el; }}
                  className={`${styles.mlayer} ${i === beat ? styles.on : ""}`}
                  src={shouldLoad ? mediaUrl(`loop/${b.monitor}.mp4`) : undefined}
                  poster={mediaUrl(`loop/${b.monitor}.jpg`)}
                  muted
                  loop
                  playsInline
                  preload={i <= beat ? "auto" : "metadata"}
                  disablePictureInPicture
                  aria-hidden="true"
                />
              ) : null;
            })}
          </MonitorFrame>
        </div>

        {/* caption per beat */}
        {!isTitle && beat > 0 && (
          <div className={styles.caption} key={current.id}>
            <span className={styles.captionLabel}>{current.label}</span>
            <h2 className={styles.captionTitle}>{current.title}</h2>
            {current.sub && <p className={styles.captionSub}>{current.sub}</p>}
          </div>
        )}

        {/* title card */}
        <div className={`${styles.title} ${isTitle ? styles.titleOn : ""}`} aria-hidden={!isTitle}>
          <div className="eyebrow">{t.hero.eyebrow}</div>
          <h1 className={`slash ${styles.h1}`}>{t.brand.name}</h1>
          <p className={styles.titleSub}>{t.brand.tagline}</p>
          <div className={styles.ctas}>
            <SlashButton href={bookHref} external>{t.hero.ctaBook}</SlashButton>
            <SlashButton variant="ghost" onClick={() => scrollToId("garage")}>{t.hero.ctaGarage}</SlashButton>
            <a className={`mono ${styles.igLink}`} href={site.instagram} target="_blank" rel="noopener noreferrer">{t.hero.ctaDm} ↗</a>
          </div>
        </div>

        {/* beat rail */}
        <nav className={styles.rail} aria-label={t.hero.railLabel}>
          <div className={styles.railTrack}><div ref={railFillRef} className={styles.railFill} /></div>
          <ul>
            {rail.map((b, i) => (
              <li key={b.id}>
                <button className={`${styles.railBtn} ${i === beat ? styles.railOn : ""}`} onClick={() => jumpTo(b.from)} aria-current={i === beat ? "step" : undefined}>
                  <span className={styles.railDot} /><span className={styles.railLabel}>{b.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button className={`mono ${styles.skip} ${beat > 0 && !isTitle ? styles.show : ""}`} onClick={() => scrollToId("garage")}>{t.hero.skip}</button>
      </div>
    </section>
  );
}
