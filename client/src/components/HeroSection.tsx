import { ArrowRight, Phone } from "lucide-react";
import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";
import { CtaButton } from "./CtaButton";

export function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  const t = getTranslations(useLocale());
  const cleanerPhoto = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=82";
  return (
    <section className="section-shell relative z-10 grid items-center gap-7 pb-10 pt-4 text-white sm:gap-8 sm:pb-18 sm:pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 lg:pb-20">
      <div>
        <p className="text-sm font-bold text-gold">{t.businessProfile.serviceArea}</p>
        <h1 className="mt-3 max-w-2xl text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.035em] min-[380px]:text-[2.05rem] sm:text-5xl lg:text-[3.7rem]">{t.hero.title}</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/72 min-[380px]:text-base sm:text-lg sm:leading-7">{t.hero.text}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CtaButton className="min-h-11 w-full sm:min-h-12 sm:w-auto" onClick={onCtaClick}>{t.hero.cta}<ArrowRight size={18} /></CtaButton>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/24 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10" href={t.businessProfile.phoneHref}><Phone size={17} />{t.businessProfile.phone}</a>
        </div>
      </div>
      <aside className="hero-product-showcase relative min-h-0 sm:min-h-[430px]" aria-label={t.hero.aria}>
        <div className="dot-pattern absolute right-0 top-0 hidden h-32 w-44 opacity-80 sm:block" aria-hidden="true" />
        <div className="absolute bottom-7 left-0 hidden h-24 w-32 dot-pattern opacity-55 sm:block" aria-hidden="true" />
        <div className="relative mx-auto max-w-[650px] pt-2 sm:ml-auto sm:pt-8">
          <div className="relative overflow-hidden rounded-[16px] bg-[#24493d] p-2 shadow-soft sm:rounded-[20px] sm:p-3">
            <img src={cleanerPhoto} alt={t.hero.imageAlt} width={760} height={520} className="h-[210px] w-full rounded-[12px] object-cover object-center min-[380px]:h-[240px] sm:h-[360px] sm:rounded-[14px] lg:h-[410px]" />
          </div>
          <div className="absolute right-3 top-0 rounded-[14px] bg-gold px-3 py-2.5 text-ink shadow-card sm:right-5 sm:rounded-[16px] sm:px-4 sm:py-3">
            <p className="text-xs font-bold text-ink/65">{t.hero.startingPrice}</p><p className="text-lg font-extrabold">{t.hero.fromPrice}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
