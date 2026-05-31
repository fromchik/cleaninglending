import { Armchair, Car, Sofa, Sparkles, SquareStack, Waves } from "lucide-react";
import { serviceOptions } from "../data/services";

const icons = {
  sofa: Sofa,
  mattress: SquareStack,
  armchair: Armchair,
  chairs: Sparkles,
  carpet: Waves,
  car_interior: Car
};

export function ServicePriceGrid() {
  return (
    <section className="section-band" id="prices">
      <div className="section-shell">
        <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-bold text-teal">Послуги та ціни</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] text-pine sm:text-3xl">Орієнтовна вартість</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-ink/70 sm:text-base md:ml-auto">
            Ціни стартові. Остаточна сума залежить від розміру, матеріалу, складності плям, запаху та кількості предметів.
          </p>
        </div>

        <div className="service-product-grid">
          {serviceOptions.map((service, index) => {
            const Icon = icons[service.value] ?? Sparkles;

            return (
              <article
                className={`relative overflow-hidden rounded-[16px] border border-ink/10 bg-white p-5 ${
                  index === 0 ? "sm:bg-mint" : ""
                }`}
                key={service.value}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-pine">
                  <Icon size={25} />
                </div>
                <h3 className="text-lg font-bold text-pine">{service.label}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-ink/65">{service.note}</p>
                <p className="mt-5 text-base font-extrabold text-ink">{service.price}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
