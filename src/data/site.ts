export const site = {
  name: "SceneDrive",
  nameFull: "SceneDrive Egypt",
  tagline: "Egypt’s 1st & only cinematic car supplier",
  taglineAr: "سيارات الإنتاج السينمائي",
  bio: "Supercars. Crash cars. Classics. Serving film, ads and music videos nationwide.",
  since: 2014,
  phoneDisplay: "+20 110 051 2487",
  phoneE164: "201100512487",
  whatsapp: "https://wa.me/201100512487",
  email: "contact@scenedrive.com",
  instagram: "https://www.instagram.com/scenedrive.eg",
  instagramHandle: "@scenedrive.eg",
  location: "Cairo, Egypt",
} as const;

export function whatsappLink(message: string) {
  return `${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
