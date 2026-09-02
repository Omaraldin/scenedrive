const cloudBase = (
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ??
  "https://res.cloudinary.com/dvghivurh"
).replace(/\/$/, "");

type Opts = {
  /** target width in CSS px; Cloudinary scales down, never up */
  w?: number;
  /** image quality preset, default auto */
  q?: "auto" | "auto:low" | "auto:eco" | "auto:good" | "auto:best";
};

/**
 * Resolve uploaded media from Cloudinary with delivery transforms:
 * images get f_auto (AVIF/WebP), q_auto and an optional width cap; videos get q_auto.
 * Key art stays local by design.
 */
export function mediaUrl(path: string, opts: Opts = {}) {
  const clean = path.replace(/^\/?media\//, "").replace(/^\//, "");
  if (clean.startsWith("art/")) return `/media/${clean}`;
  const isVideo = clean.toLowerCase().endsWith(".mp4");
  const q = opts.q ?? "auto";
  if (isVideo) return `${cloudBase}/video/upload/q_${q}/scenedrive/${clean}`;
  const tx = [`f_auto`, `q_${q}`, ...(opts.w ? [`w_${Math.round(opts.w)}`, "c_limit"] : [])].join(",");
  return `${cloudBase}/image/upload/${tx}/scenedrive/${clean}`;
}
