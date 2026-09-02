import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import CreditsTicker from "@/components/CreditsTicker/CreditsTicker";
import Garage from "@/components/Garage/Garage";
import Scenes from "@/components/Scenes/Scenes";
import Filmography from "@/components/Filmography/Filmography";
import CallSheet from "@/components/CallSheet/CallSheet";
import Footer from "@/components/Footer/Footer";
import { getDictionary, isLocale, type Locale } from "@/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const t = getDictionary(loc);
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CreditsTicker />
        <Garage locale={loc} t={t} />
        <Scenes locale={loc} t={t} />
        <Filmography locale={loc} t={t} />
        <CallSheet />
      </main>
      <Footer locale={loc} t={t} />
    </>
  );
}
