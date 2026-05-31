import { steps } from "../data/content";

export function HowItWorks() {
  return (
    <section className="section-band bg-white">
      <div className="section-shell">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm font-bold text-teal">Як це працює</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-pine sm:text-3xl">Від заявки до чистих меблів</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => (
            <article className="rounded-[16px] border border-ink/10 bg-cream p-4" key={step}>
              <p className="text-sm font-semibold text-gold">0{index + 1}</p>
              <p className="mt-3 text-sm leading-6 text-ink/75">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
