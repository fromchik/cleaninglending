import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";
export function TrustHighlights() {
  const t = getTranslations(useLocale());
  return <section className="section-band"><div className="section-shell"><div className="rounded-[16px] border border-[#E7D8A8] bg-[#F5F1E6] px-4 py-7 text-ink shadow-soft sm:rounded-[20px] sm:px-8 sm:py-12 lg:px-12">
    <div className="mb-9 text-center"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-pine/70">{t.stages.eyebrow}</p><h2 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl">{t.stages.title}</h2></div>
    <div className="relative mx-auto max-w-3xl"><div className="absolute left-[21px] top-0 h-full w-px bg-pine/35" aria-hidden="true" /><div className="grid gap-7 sm:gap-10">{t.cleaningStages.map((stage, index) => <article className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-4 sm:gap-7" key={stage.title}><div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-base font-bold shadow-card ${index % 3 === 1 ? "bg-[#D3AE43] text-ink" : "bg-pine text-white"}`}>{index + 1}</div><div className="pt-1"><h3 className="text-lg font-bold leading-snug">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-ink/76">{stage.text}</p></div></article>)}</div></div>
  </div></div></section>;
}
