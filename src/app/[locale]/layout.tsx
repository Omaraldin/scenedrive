import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alexandria, Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary, isLocale, locales, dirOf, type Locale } from "@/i18n";
import { mediaUrl } from "@/lib/media";
import { site } from "@/data/site";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display", display: "swap" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const arabic = Alexandria({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-arabic", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "en");
  const canonical = locale === "ar" ? "/ar" : "/";
  return {
    title: t.meta.title,
    description: t.meta.description,
    metadataBase: new URL("https://scenedrive.eg"),
    applicationName: site.nameFull,
    creator: site.nameFull,
    category: "Film production services",
    keywords: ["cinematic cars Egypt", "picture cars Egypt", "film car rental Cairo", "supercars for filming", "crash cars", "سيارات تصوير", "سيارات سينمائية"],
    alternates: { canonical, languages: { "x-default": "/", en: "/", ar: "/ar" } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 } },
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: canonical,
      siteName: site.nameFull,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.nameFull} — ${site.tagline}` }],
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
    },
    twitter: { card: "summary_large_image", title: t.meta.ogTitle, description: t.meta.ogDescription, images: ["/og.jpg"] },
    icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = getDictionary(loc);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.nameFull,
    url: "https://scenedrive.eg",
    image: "https://scenedrive.eg/og.jpg",
    description: loc === "ar" ? site.taglineAr : site.bio,
    telephone: `+${site.phoneE164}`,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
    areaServed: { "@type": "Country", name: "Egypt" },
    sameAs: [site.instagram],
  };
  return (
    <html lang={loc} dir={dirOf(loc)} className={`${display.variable} ${body.variable} ${mono.variable} ${arabic.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preload" as="image" href={mediaUrl("loop/chase_palace.jpg", { w: 1600 })} fetchPriority="high" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <LocaleProvider locale={loc} dictionary={dict}>
          <SmoothScroll />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
