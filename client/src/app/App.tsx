import { BeforeAfterGallery } from "../components/BeforeAfterGallery";
import { FaqContactSection } from "../components/FaqContactSection";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { Layout } from "../components/Layout";
import { LeadForm } from "../components/LeadForm";
import { PhotoGuide } from "../components/PhotoGuide";
import { QuickFacts } from "../components/QuickFacts";
import { ServicesOverview } from "../components/ServicesOverview";
import { TrustHighlights } from "../components/TrustHighlights";
import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";

function scrollToForm() {
  document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function App() {
  const t = getTranslations(useLocale());

  return (
    <Layout>
      <div className="hero-stage">
        <Header onCtaClick={scrollToForm} />
        <HeroSection onCtaClick={scrollToForm} />
      </div>
      <main>
        <QuickFacts />
        <ServicesOverview />
        <LeadForm />
        <TrustHighlights />
        <PhotoGuide />
        <BeforeAfterGallery />
        <FaqContactSection onCtaClick={scrollToForm} />
      </main>
      <footer className="section-shell py-7 text-center text-sm text-ink/55">
        © 2026 {t.businessProfile.name}. {t.footer}
      </footer>
    </Layout>
  );
}
