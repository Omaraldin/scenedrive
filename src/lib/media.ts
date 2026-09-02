const cloudBase = (
  process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL ??
  "https://res.cloudinary.com/dvghivurh"
).replace(/\/$/, "");

/** Resolve uploaded media from Cloudinary. Key art stays local by design. */
export function mediaUrl(path: string) {
  const clean = path.replace(/^\/?media\//, "").replace(/^\//, "");
  if (clean.startsWith("art/")) return `/media/${clean}`;
  const resource = clean.toLowerCase().endsWith(".mp4") ? "video" : "image";
  return `${cloudBase}/${resource}/upload/scenedrive/${clean}`;
}
