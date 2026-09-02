"use client";
import { useEffect, useRef } from "react";
import { mediaUrl } from "@/lib/media";

type Props = {
  /** path under /media, e.g. "loop/chase_tunnel.mp4" or "v/DWudGrWDKBK_00.mp4" */
  src: string;
  poster?: string;
  className?: string;
  /** "inview" autoplays while visible (default). "hover" plays only on hover/focus of the nearest [data-hover-scope] or itself. "manual" never autoplays. */
  mode?: "inview" | "hover" | "manual";
  /** force play/pause from a parent (e.g. hero beat manager) */
  active?: boolean;
  alt?: string;
  onReady?: (el: HTMLVideoElement) => void;
};

/** Muted, looping, playsinline video that only runs when it should. Never seeks on scroll. */
export default function VideoLoop({ src, poster, className = "", mode = "inview", active, alt = "", onReady }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    onReady?.(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const play = () => { if (!reduce) el.play().catch(() => {}); };
    const pause = () => el.pause();

    if (typeof active === "boolean") {
      if (active) play();
      else pause();
      return;
    }
    if (mode === "manual") return;
    if (mode === "hover") {
      const scope = (el.closest("[data-hover-scope]") as HTMLElement | null) ?? el;
      const on = () => play();
      const off = () => { pause(); };
      scope.addEventListener("pointerenter", on);
      scope.addEventListener("pointerleave", off);
      scope.addEventListener("focusin", on);
      scope.addEventListener("focusout", off);
      return () => {
        scope.removeEventListener("pointerenter", on);
        scope.removeEventListener("pointerleave", off);
        scope.removeEventListener("focusin", on);
        scope.removeEventListener("focusout", off);
      };
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? play() : pause())), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, active, onReady]);

  return (
    <video
      ref={ref}
      className={className}
      src={mediaUrl(src)}
      poster={poster ? mediaUrl(poster) : undefined}
      muted
      loop
      playsInline
      preload={active === false ? "metadata" : "auto"}
      aria-label={alt || undefined}
      disablePictureInPicture
    />
  );
}
