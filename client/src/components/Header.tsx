import { Phone } from "lucide-react";
import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";
import { BrandLogo } from "./BrandLogo";
import { CtaButton } from "./CtaButton";

type HeaderProps = { onCtaClick: () => void };

export function Header({ onCtaClick }: HeaderProps) {
  const t = getTranslations(useLocale());

  return (
    <header className="section-shell relative z-30 py-3 text-white sm:py-4">
      <div className="flex items-center justify-between gap-2 rounded-[18px] border border-white/12 bg-[#285243]/72 px-2.5 py-2 backdrop-blur sm:gap-3 sm:rounded-full sm:px-4">
        <BrandLogo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-white/72 lg:flex" aria-label={t.nav.aria}>
          <a className="transition hover:text-white" href="#services">{t.nav.services}</a>
          <a className="transition hover:text-white" href="#work">{t.nav.work}</a>
          <a className="transition hover:text-white" href="#faq">{t.nav.contacts}</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 text-white transition hover:bg-white/10 sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-bold" href={t.businessProfile.phoneHref} aria-label={t.nav.call}>
            <Phone size={16} />
            <span className="hidden sm:inline">{t.businessProfile.phone}</span>
          </a>
          <CtaButton className="min-h-9 whitespace-nowrap px-3 py-2 text-xs shadow-none sm:min-h-10 sm:px-4 sm:text-sm" onClick={onCtaClick}>
            <span className="sm:hidden">{t.nav.price}</span>
            <span className="hidden sm:inline">{t.nav.estimate}</span>
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
