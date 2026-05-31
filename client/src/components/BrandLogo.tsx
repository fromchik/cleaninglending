import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";

export function BrandLogo() {
  const t = getTranslations(useLocale());
  return (
    <a aria-label={t.businessProfile.name} className="group flex min-w-0 items-center gap-2.5" href="#">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-gold shadow-[0_7px_18px_rgba(18,42,34,0.2)] transition-transform group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
        <svg aria-hidden="true" className="h-8 w-8 text-pine sm:h-9 sm:w-9" fill="none" viewBox="0 0 48 48">
          <path d="M12.5 25.5v-3.25a4 4 0 0 1 4-4h15a4 4 0 0 1 4 4v3.25" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          <path d="M9.5 24.75a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3V28h16v-3.25a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3V34H9.5v-9.25Z" fill="currentColor" />
          <path d="M14 34v3M34 34v3" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          <path className="logo-sparkle" d="m35.25 8 .95 2.8L39 11.75l-2.8.95-.95 2.8-.95-2.8-2.8-.95 2.8-.95.95-2.8Z" fill="#fff" />
        </svg>
      </span>
      <span className="min-w-0 leading-none">
        <span className="block truncate text-[17px] font-bold tracking-[-0.035em] text-white sm:text-[19px]">Clean<span className="text-gold">Pro</span></span>
        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.15em] text-white/58 sm:block">{t.hero.title}</span>
      </span>
    </a>
  );
}
