import { Clock, MapPin, MessageCircle, Wallet } from "lucide-react";
import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";
const icons = [Wallet, Clock, MapPin, MessageCircle];
export function QuickFacts() {
  const t = getTranslations(useLocale());
  return <section className="section-shell -mt-8 pb-10" aria-label={t.quickFactsAria}><div className="furni-stat-strip relative z-20 grid gap-0 overflow-hidden rounded-[16px] shadow-card sm:grid-cols-2 lg:grid-cols-4">
    {t.quickFacts.map((fact, index) => { const Icon = icons[index] ?? Wallet; return <article className="flex gap-3 border-b border-ink/10 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0" key={fact.label}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-pine"><Icon size={18} /></span><span className="min-w-0"><span className="block text-xs font-bold text-ink/52">{fact.label}</span><span className="mt-1 block text-base font-extrabold text-pine">{fact.value}</span><span className="mt-1 block text-sm leading-5 text-ink/62">{fact.note}</span></span></article>; })}
  </div></section>;
}
