import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alexandria, Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getDictionary, isLocale, locales, dirOf, type Locale } from "@/i18n";

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
  return {
    title: t.meta.title,
    description: t.meta.description,
    metadataBase: new URL("https://scenedrive.eg"),
    alternates: { languages: { en: "/", ar: "/ar" } },
    openGraph: { title: t.meta.ogTitle, description: t.meta.ogDescription, images: ["/og.jpg"], type: "website", locale: locale === "ar" ? "ar_EG" : "en_US" },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#0b0b0d", colorScheme: "dark" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = getDictionary(loc);
  return (
    <html lang={loc} dir={dirOf(loc)} className={`${display.variable} ${body.variable} ${mono.variable} ${arabic.variable}`}>
      <body>
        <LocaleProvider locale={loc} dictionary={dict}>
          <SmoothScroll />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
