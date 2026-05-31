import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const filesToScan = [
  "index.html",
  "src/app/App.tsx",
  "src/components/Header.tsx",
  "src/components/BrandLogo.tsx",
  "src/components/HeroSection.tsx",
  "src/components/QuickFacts.tsx",
  "src/components/LeadForm.tsx",
  "src/components/FileUploadField.tsx",
  "src/components/ServicesOverview.tsx",
  "src/components/TrustHighlights.tsx",
  "src/components/PhotoGuide.tsx",
  "src/components/ServicePriceGrid.tsx",
  "src/components/BeforeAfterGallery.tsx",
  "src/components/HowItWorks.tsx",
  "src/components/FaqContactSection.tsx",
  "src/components/SuccessMessage.tsx",
  "src/data/content.ts",
  "src/data/services.ts"
];

const mojibakeMarkers = ["Р ", "Рџ", "Рќ", "Р‘", "Р”", "РҐ", "Р©", "С–", "С—", "СЊ", "Сѓ", "вЂ", "в‚", "В©"];
const failures = [];
const publicComponentFiles = filesToScan.filter((relativePath) => relativePath.startsWith("src/components/"));
const repoRoot = path.resolve(root, "..");

for (const relativePath of filesToScan) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing file: ${relativePath}`);
    continue;
  }

  const text = fs.readFileSync(absolutePath, "utf8");
  for (const marker of mojibakeMarkers) {
    if (text.includes(marker)) {
      failures.push(`${relativePath} contains mojibake marker "${marker}"`);
    }
  }
}

for (const relativePath of publicComponentFiles) {
  const text = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (text.includes("font-black")) {
    failures.push(`${relativePath} must not use font-black`);
  }
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!html.includes('<html lang="uk">')) {
  failures.push('index.html must use lang="uk"');
}
if (!html.includes("Хімчистка меблів у Києві")) {
  failures.push("index.html title/description must be Ukrainian and local");
}

const content = fs.readFileSync(path.join(root, "src/data/content.ts"), "utf8");
const translations = fs.readFileSync(path.join(root, "src/i18n/translations.ts"), "utf8");
for (const exportName of ["businessProfile", "quickFacts", "photoTips", "whyChooseUs", "cleaningStages", "beforeAfterCases", "steps", "faqs"]) {
  if (!content.includes(`export const ${exportName}`)) {
    failures.push(`content.ts must export ${exportName}`);
  }
}

const app = fs.readFileSync(path.join(root, "src/app/App.tsx"), "utf8");
for (const componentName of ["QuickFacts", "ServicesOverview", "TrustHighlights", "PhotoGuide"]) {
  if (!app.includes(componentName)) {
    failures.push(`App.tsx must render ${componentName}`);
  }
}
if (app.includes("HowItWorks")) {
  failures.push("App.tsx must not render the old process cards section");
}
if (app.includes("ServicePriceGrid")) {
  failures.push("App.tsx must not render the separate service price section");
}

const header = fs.readFileSync(path.join(root, "src/components/Header.tsx"), "utf8");
if (header.includes('href="#prices"')) {
  failures.push("Header must not link to the removed prices section");
}
if (!header.includes("<BrandLogo")) {
  failures.push("Header must render the BrandLogo component");
}

const brandLogo = fs.readFileSync(path.join(root, "src/components/BrandLogo.tsx"), "utf8");
for (const marker of ["aria-label={t.businessProfile.name}", 'viewBox="0 0 48 48"', "{t.hero.title}", "logo-sparkle"]) {
  if (!brandLogo.includes(marker)) {
    failures.push(`BrandLogo must include ${marker}`);
  }
}
if (!html.includes('href="/favicon.svg"')) {
  failures.push("index.html must link to the CleanPro favicon");
}

const gallery = fs.readFileSync(path.join(root, "src/components/BeforeAfterGallery.tsx"), "utf8");
if (!gallery.includes('loading="lazy"')) {
  failures.push("BeforeAfterGallery images must be lazy loaded");
}
if (!gallery.includes("aspect-")) {
  failures.push("BeforeAfterGallery must reserve stable image aspect ratios");
}
if (!gallery.includes("min-[420px]:grid-cols-2")) {
  failures.push("BeforeAfterGallery must stack before/after images below 420px");
}
for (const removedText of [
  "Тимчасові приклади",
  "Тимчасовий приклад",
  "Для реального сайту",
  "краще замінити власними кадрами"
]) {
  if (content.includes(removedText) || gallery.includes(removedText)) {
    failures.push(`Public gallery copy must not include internal draft text "${removedText}"`);
  }
}
if (!gallery.includes("{t.gallery.title}") || !translations.includes('title: "Роботи до/після"')) {
  failures.push("BeforeAfterGallery must use the concise before-and-after heading");
}
if (gallery.includes("item.title") || gallery.includes("item.note")) {
  failures.push("BeforeAfterGallery cards must stay photo-only");
}

const styles = fs.readFileSync(path.join(root, "src/styles/index.css"), "utf8");
for (const marker of [".hero-stage", ".dot-pattern", "#315f4f", "#e5c243"]) {
  if (!styles.toLowerCase().includes(marker)) {
    failures.push(`index.css must include reference-style marker ${marker}`);
  }
}
if (!styles.includes("overflow-x: hidden")) {
  failures.push("Global styles must prevent mobile horizontal overflow");
}

const button = fs.readFileSync(path.join(root, "src/components/CtaButton.tsx"), "utf8");
if (!button.includes("bg-gold") || !button.includes("text-ink")) {
  failures.push("CtaButton must use the yellow reference-style primary button");
}

const hero = fs.readFileSync(path.join(root, "src/components/HeroSection.tsx"), "utf8");
for (const marker of ["dot-pattern", "cleanerPhoto", "alt={t.hero.imageAlt}"]) {
  if (!hero.includes(marker)) {
    failures.push(`HeroSection must include ${marker}`);
  }
}
if (!translations.includes('imageAlt: "Клінер чистить')) {
  failures.push("translations.ts must include the localized hero image alt text");
}

for (const removedText of ["Telegram для фото", "Сушка зазвичай"]) {
  if (hero.includes(removedText)) {
    failures.push(`HeroSection must not include removed text "${removedText}"`);
  }
}

for (const marker of ["hero-product-showcase"]) {
  if (!hero.includes(marker)) {
    failures.push(`HeroSection must use the new default interior marker ${marker}`);
  }
}
if (!hero.includes("min-h-0 sm:min-h-[430px]") || !hero.includes("min-[380px]:h-[240px]")) {
  failures.push("HeroSection must use mobile-safe hero image sizing");
}

const leadForm = fs.readFileSync(path.join(root, "src/components/LeadForm.tsx"), "utf8");
if (!leadForm.includes("grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-3")) {
  failures.push("LeadForm service choices must be one column on narrow phones");
}
if (leadForm.includes("fetch(") || leadForm.includes("FormData")) {
  failures.push("LeadForm must not transmit customer data in the static Vercel release");
}
if (!leadForm.includes("setIsComplete(true)") || !leadForm.includes("window.setTimeout(resolve, 250)")) {
  failures.push("LeadForm must complete locally after the short submit transition");
}

const successMessage = fs.readFileSync(path.join(root, "src/components/SuccessMessage.tsx"), "utf8");
for (const marker of ['role="dialog"', "aria-modal=\"true\"", "event.target === event.currentTarget", 'event.key === "Escape"']) {
  if (!successMessage.includes(marker)) {
    failures.push(`SuccessMessage must include popup marker ${marker}`);
  }
}
if (leadForm.includes("leadId") || successMessage.includes("leadId") || successMessage.includes("t.lead")) {
  failures.push("Static showcase success flow must not display a generated lead number");
}

for (const marker of [
  "Дякуємо! Форму заповнено.",
  "Дані перевірено.",
  "Натискання перевірить заповнені поля локально. Дані нікуди не надсилаються.",
  "Thank you! The form is complete.",
  "The details have been checked.",
  "Submitting checks the completed fields locally. Your details are not sent anywhere."
]) {
  if (!translations.includes(marker)) {
    failures.push(`translations.ts must include static release copy "${marker}"`);
  }
}
for (const removedText of ["Номер заявки:", "Request number:"]) {
  if (translations.includes(removedText)) {
    failures.push(`translations.ts must not include static release lead number copy "${removedText}"`);
  }
}

const viteConfig = fs.readFileSync(path.join(root, "vite.config.ts"), "utf8");
if (viteConfig.includes('"/api"')) {
  failures.push("vite.config.ts must not proxy the disabled API in the static Vercel release");
}

const vercelConfigPath = path.join(root, "vercel.json");
if (!fs.existsSync(vercelConfigPath)) {
  failures.push("Missing file: vercel.json");
} else {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"));
  const spaRewrite = vercelConfig.rewrites?.some(
    (rewrite) => rewrite.source === "/(.*)" && rewrite.destination === "/index.html"
  );
  if (
    vercelConfig.framework !== "vite" ||
    vercelConfig.buildCommand !== "npm run build" ||
    vercelConfig.outputDirectory !== "dist" ||
    !spaRewrite
  ) {
    failures.push("vercel.json must configure the Vite build, dist output, and SPA rewrite");
  }
}

const readme = fs.readFileSync(path.join(repoRoot, "README.md"), "utf8");
for (const marker of [
  "## Static Vercel release",
  "**Root Directory** to `client`",
  "does not send personal data or photos",
  "`server` directory is a dormant base"
]) {
  if (!readme.includes(marker)) {
    failures.push(`README.md must document static Vercel release marker "${marker}"`);
  }
}

const servicesOverview = fs.readFileSync(path.join(root, "src/components/ServicesOverview.tsx"), "utf8");
for (const marker of ["benefits-mosaic", "benefits-mosaic-feature", "benefits-mosaic-support"]) {
  if (!servicesOverview.includes(marker)) {
    failures.push(`ServicesOverview must include ${marker}`);
  }
}

const trustHighlights = fs.readFileSync(path.join(root, "src/components/TrustHighlights.tsx"), "utf8");
if (!trustHighlights.includes("bg-[#F5F1E6]")) {
  failures.push("TrustHighlights must use a warm neutral timeline background");
}
if (trustHighlights.includes("bg-gold")) {
  failures.push("TrustHighlights must not use the saturated gold timeline background");
}

for (const marker of [".furni-stat-strip", ".section-band"]) {
  if (!styles.includes(marker)) {
    failures.push(`index.css must include the default interior layout marker ${marker}`);
  }
}

const services = fs.readFileSync(path.join(root, "src/components/ServicePriceGrid.tsx"), "utf8");
if (!services.includes("service-product-grid")) {
  failures.push("ServicePriceGrid must use the new service-product-grid layout");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Static verification passed");
