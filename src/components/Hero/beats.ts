import type { Dictionary } from "@/i18n";

export type Beat = {
  id: BeatId;
  /** scroll progress where this beat starts (0..1) */
  from: number;
  label: string;
  title: string;
  sub?: string;
  /** screen layer: muted loop under /media/loop (undefined = frame sequence / slate) */
  screen?: string;
  /** still image layer under /media (used by the title card) */
  image?: string;
  /** monitor layer: raw-from-set loop under /media/loop */
  monitor?: string;
  monitorTag?: string;
  source: "real" | "ai" | "seq" | "slate" | "title";
};

export type BeatId = keyof Dictionary["hero"]["beats"];

type BeatBase = Omit<Beat, "label" | "title" | "sub" | "monitorTag">;

/** Timing and media per beat. Copy comes from the dictionary in getBeats(). */
const BEAT_BASE: readonly BeatBase[] = [
  { id: "slate", from: 0, source: "slate" },
  { id: "wide", from: 0.07, screen: "chase_palace", monitor: "palace_lineup", source: "real" },
  { id: "chase", from: 0.21, screen: "chase_downtown", monitor: "downtown_night", source: "real" },
  { id: "tunnel", from: 0.38, screen: "chase_tunnel", monitor: "tunnel_chase", source: "real" },
  { id: "roll", from: 0.58, monitor: "h2_slide_bts", source: "seq" },
  { id: "aftermath", from: 0.79, screen: "h2_aftermath", monitor: "h2_bts_full", source: "real" },
  { id: "title", from: 0.91, image: "art/heist.jpg", source: "title" },
];

/** Beats with their copy resolved for the given dictionary. */
export function getBeats(t: Dictionary): Beat[] {
  return BEAT_BASE.map((b) => {
    const copy = t.hero.beats[b.id];
    return {
      ...b,
      label: copy.label,
      title: copy.title,
      sub: "sub" in copy ? copy.sub : undefined,
      monitorTag: "monitor" in copy ? copy.monitor : undefined,
    };
  });
}

export const SCENE_SECONDS = 54.7;
export const ROLL_FRAMES = 90;

export function beatAt(p: number): { index: number; t: number } {
  let index = 0;
  for (let i = 0; i < BEAT_BASE.length; i++) if (p >= BEAT_BASE[i].from) index = i;
  const from = BEAT_BASE[index].from;
  const to = index + 1 < BEAT_BASE.length ? BEAT_BASE[index + 1].from : 1;
  const t = to > from ? Math.min(1, Math.max(0, (p - from) / (to - from))) : 0;
  return { index, t };
}

export function timecode(p: number): string {
  const s = p * SCENE_SECONDS;
  const sec = Math.floor(s);
  const fr = Math.floor((s - sec) * 24);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `TC 00:${mm}:${ss}:${String(fr).padStart(2, "0")}`;
}
