import type { Locale } from "./locale";

const shared = {
  name: "CleanPro",
  phone: "+380 99 111 22 33",
  phoneHref: "tel:+380991112233",
  telegramHref: "https://t.me/cleaning_demo"
};

export const translations = {
  ua: {
    businessProfile: { ...shared, city: "Київ", serviceArea: "Київ і найближчі райони" },
    nav: { aria: "Навігація", services: "Послуги", work: "Результат", contacts: "Контакти", call: "Подзвонити", price: "Ціна", estimate: "Розрахунок" },
    hero: { title: "Хімчистка меблів на дому", text: "Дивани, матраци, крісла, стільці, килими та автосалони.", cta: "Отримати розрахунок", aria: "Фото клінінгу меблів і підказки для заявки", imageAlt: "Клінер чистить м'які меблі екстрактором", startingPrice: "Стартова ціна", fromPrice: "від 900 грн" },
    quickFacts: [
      { label: "Ціна", value: "від 900 грн", note: "точніше після фото" },
      { label: "Сушка", value: "4-8 год", note: "залежить від тканини" },
      { label: "Виїзд", value: "Київ і поруч", note: "район уточнимо в заявці" },
      { label: "Зв'язок", value: "Telegram або телефон", note: "відповімо після фото" }
    ],
    quickFactsAria: "Коротко про послугу",
    benefits: { eyebrow: "Переваги сервісу", title: "Чому обирають нас", intro: "Не обіцяємо неможливого. Спочатку оцінюємо тканину і плями, потім пояснюємо вартість та очікуваний результат.", featureLabel: "Спочатку домовляємось", supportLabel: "Дбайливо до матеріалу" },
    whyChooseUs: [
      { title: "Чесна оцінка за фото", text: "До виїзду дивимося на розмір меблів, матеріал і складність плям. Так ви заздалегідь розумієте орієнтовну вартість роботи.", image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=82", imageAlt: "Майстер готує обладнання для чистки меблів" },
      { title: "Засоби під конкретну тканину", text: "Перед початком оглядаємо оббивку і підбираємо склад під матеріал та тип забруднення.", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=82", imageAlt: "Засоби для чистки меблів" },
      { title: "Усе обладнання приїжджає з майстром", text: "Чистимо меблі на місці: вам не потрібно організовувати доставку дивана чи матраца.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82", imageAlt: "Клінер з обладнанням для чистки" },
      { title: "Реалістичні очікування", text: "Одразу пояснюємо, що можна прибрати, від чого залежить результат і скільки часу сохнутиме тканина.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82", imageAlt: "Консультація клієнта щодо чистки меблів" }
    ],
    stages: { eyebrow: "Процес роботи", title: "Етапи чистки" },
    cleaningStages: [
      { title: "Огляд і оцінка", text: "Визначаємо тип тканини, ступінь забруднення, плями і ділянки з запахом." },
      { title: "Сухе прибирання", text: "Прибираємо пил, крихти, шерсть і поверхневі забруднення перед вологою чисткою." },
      { title: "Нанесення засобу", text: "Підбираємо склад під матеріал і обробляємо проблемні місця." },
      { title: "Аквачистка", text: "Промиваємо тканину екстрактором, витягуємо бруд і залишки засобу з оббивки." },
      { title: "Видалення вологи", text: "Екстрактор забирає більшу частину води, після чого тканина поступово досихає." },
      { title: "Фінальні поради", text: "Пояснюємо, скільки сохнутиме тканина і як провітрювати кімнату після чистки." }
    ],
    photoGuide: { eyebrow: "Фото для оцінки", title: "Що сфотографувати, щоб ціна була точнішою", intro: "Не треба робити студійні кадри. Достатньо показати розмір меблів, проблемні місця і матеріал, якщо його можна визначити.", photo: "Фото" },
    photoTips: ["Загальний вигляд меблів з відстані 1-2 метри.", "Крупно плями, потертості або місця із запахом.", "Бірку тканини чи матеріалу, якщо вона збереглася."],
    gallery: { eyebrow: "Результат чистки", title: "Роботи до/після", before: "До", after: "Після", beforeAlt: "Меблі до чистки", afterAlt: "Меблі після чистки" },
    faq: { eyebrow: "Питання", title: "Коротко про важливе", contacts: "Контакти", contactsTitle: "Залиште заявку, і ми підкажемо ціну", cta: "Заповнити заявку" },
    faqs: [
      { question: "Скільки сохнуть меблі після хімчистки?", answer: "Зазвичай 4-8 годин. Точний час залежить від тканини, наповнювача, вентиляції в кімнаті та кількості вологи після чистки." },
      { question: "Чому ціна може відрізнятися від вартості «від»?", answer: "Фінальна сума залежить від розміру меблів, матеріалу, складності плям, запаху та кількості предметів. Фото допомагають назвати ближчу до реальності ціну." },
      { question: "Чи можна прибрати запах?", answer: "У багатьох випадках так, але результат залежить від джерела запаху і того, як давно проблема з'явилася. Краще одразу описати це в заявці." },
      { question: "Виїжджаєте за межі Києва?", answer: "Так, у найближчі райони за домовленістю. Вкажіть місто або район у формі, і ми підкажемо умови виїзду." }
    ],
    form: {
      eyebrow: "Заявка на чистку", title: "Опишіть меблі, ми підкажемо ціну", intro: "Оберіть послугу, залиште район і контакт. Фото допоможуть майстру швидше оцінити обсяг роботи.", selected: "Обрано:", service: "Що потрібно почистити", location: "Район / місто", locationPlaceholder: "Наприклад: Київ, Позняки", phone: "Телефон", comment: "Коментар", optional: "(необов'язково)", commentPlaceholder: "Опишіть плями, запах, приблизний розмір меблів або зручний час для зв'язку", maxChars: "До 500 символів", sending: "Перевіряємо...", submit: "Отримати ціну за фото", privacy: "Натискання перевірить заповнені поля локально. Дані нікуди не надсилаються.",
      errors: { maxPhotos: "Можна додати до 6 фото.", imagesOnly: "Додайте лише зображення.", maxFileSize: "Кожне фото має бути до 10 MB.", service: "Оберіть послугу.", location: "Вкажіть район або місто.", locationShort: "Район або місто має містити щонайменше 2 символи.", phone: "Вкажіть телефон.", phoneInvalid: "Вкажіть коректний номер телефону.", photos: "Додайте хоча б одне фото меблів.", comment: "Коментар має бути до 500 символів.", submit: "Не вдалося надіслати заявку." }
    },
    upload: { label: "Фото меблів", add: "Додайте до 6 фото", formats: "JPG, PNG або WEBP до 10 MB кожне", tip: "Найкраще: загальний вигляд, пляма крупно і бірка тканини, якщо вона є.", remove: "Видалити" },
    success: { close: "Закрити", title: "Дякуємо! Форму заповнено.", text: "Дані перевірено.", ok: "Добре" },
    footer: "Хімчистка меблів у Києві з розрахунком за фото.",
    services: [
      { value: "sofa", label: "Диван", price: "від 900 грн", note: "2-3 місця, тканина або велюр" },
      { value: "mattress", label: "Матрац", price: "від 800 грн", note: "плями, пил, запахи, освіження" },
      { value: "armchair", label: "Крісло", price: "від 450 грн", note: "домашні та офісні крісла" },
      { value: "chairs", label: "Стільці", price: "від 120 грн", note: "за один м'який стілець" },
      { value: "carpet", label: "Килим", price: "від 90 грн/м²", note: "ворс, доріжки, ковролін" },
      { value: "car_interior", label: "Автосалон", price: "від 1800 грн", note: "сидіння, підлога, багажник" }
    ]
  },
  en: {
    businessProfile: { ...shared, city: "Kyiv", serviceArea: "Kyiv and nearby areas" },
    nav: { aria: "Navigation", services: "Services", work: "Results", contacts: "Contacts", call: "Call us", price: "Price", estimate: "Estimate" },
    hero: { title: "Furniture cleaning at your home", text: "Sofas, mattresses, armchairs, chairs, carpets and car interiors.", cta: "Get an estimate", aria: "Furniture cleaning photo and quote tips", imageAlt: "Cleaner washing upholstered furniture with an extractor", startingPrice: "Starting price", fromPrice: "from UAH 900" },
    quickFacts: [
      { label: "Price", value: "from UAH 900", note: "confirmed after photos" },
      { label: "Drying", value: "4-8 hours", note: "depends on the fabric" },
      { label: "Service area", value: "Kyiv and nearby", note: "confirm your area in the form" },
      { label: "Contact", value: "Telegram or phone", note: "we reply after reviewing photos" }
    ],
    quickFactsAria: "Service overview",
    benefits: { eyebrow: "Service benefits", title: "Why choose us", intro: "We do not promise the impossible. First we assess the fabric and stains, then explain the price and the expected result.", featureLabel: "Agree on details first", supportLabel: "Care for every material" },
    whyChooseUs: [
      { title: "Honest estimate from photos", text: "Before the visit, we review the furniture size, material and stain complexity. You understand the approximate price in advance.", image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=82", imageAlt: "Cleaner preparing equipment for furniture cleaning" },
      { title: "Products selected for the fabric", text: "Before cleaning, we inspect the upholstery and select a product for the material and type of dirt.", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=82", imageAlt: "Furniture cleaning products" },
      { title: "Equipment arrives with the cleaner", text: "We clean furniture on site. You do not need to arrange delivery for your sofa or mattress.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82", imageAlt: "Cleaner with furniture cleaning equipment" },
      { title: "Realistic expectations", text: "We explain what can be removed, what affects the result and how long the fabric will take to dry.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=82", imageAlt: "Furniture cleaning consultation" }
    ],
    stages: { eyebrow: "Our process", title: "Cleaning stages" },
    cleaningStages: [
      { title: "Inspection and estimate", text: "We identify the fabric type, level of dirt, stains and areas with odors." },
      { title: "Dry vacuuming", text: "We remove dust, crumbs, hair and surface dirt before wet cleaning." },
      { title: "Product application", text: "We choose a solution for the material and treat problem areas." },
      { title: "Extractor cleaning", text: "We rinse the fabric with an extractor and remove dirt and product residue from the upholstery." },
      { title: "Moisture removal", text: "The extractor removes most of the water, then the fabric gradually finishes drying." },
      { title: "Final advice", text: "We explain the drying time and how to ventilate the room after cleaning." }
    ],
    photoGuide: { eyebrow: "Photos for an estimate", title: "What to photograph for a more accurate price", intro: "You do not need studio-quality photos. Show the furniture size, problem areas and material if it can be identified.", photo: "Photo" },
    photoTips: ["Full view of the furniture from 1-2 meters away.", "Close-up of stains, worn areas or places with odors.", "Fabric or material tag, if it is still attached."],
    gallery: { eyebrow: "Cleaning results", title: "Before and after", before: "Before", after: "After", beforeAlt: "Furniture before cleaning", afterAlt: "Furniture after cleaning" },
    faq: { eyebrow: "Questions", title: "The essentials", contacts: "Contacts", contactsTitle: "Send a request and we will estimate the price", cta: "Fill out the form" },
    faqs: [
      { question: "How long does furniture take to dry after cleaning?", answer: "Usually 4-8 hours. The exact time depends on the fabric, filling, room ventilation and moisture remaining after cleaning." },
      { question: "Why can the final price differ from the starting price?", answer: "The final price depends on furniture size, material, stain complexity, odors and the number of items. Photos help us provide a more realistic estimate." },
      { question: "Can you remove odors?", answer: "In many cases, yes. The result depends on the source of the odor and how long it has been present. Please describe it in the request." },
      { question: "Do you work outside Kyiv?", answer: "Yes, in nearby areas by arrangement. Enter your city or area in the form and we will confirm the terms." }
    ],
    form: {
      eyebrow: "Cleaning request", title: "Describe your furniture and we will estimate the price", intro: "Choose a service and leave your area and contact details. Photos help the cleaner estimate the work faster.", selected: "Selected:", service: "What needs cleaning", location: "Area / city", locationPlaceholder: "For example: Kyiv, Pozniaky", phone: "Phone", comment: "Comment", optional: "(optional)", commentPlaceholder: "Describe stains, odors, approximate furniture size or a convenient time to contact you", maxChars: "Up to 500 characters", sending: "Checking...", submit: "Get a photo estimate", privacy: "Submitting checks the completed fields locally. Your details are not sent anywhere.",
      errors: { maxPhotos: "You can add up to 6 photos.", imagesOnly: "Please add images only.", maxFileSize: "Each photo must be up to 10 MB.", service: "Choose a service.", location: "Enter your area or city.", locationShort: "Area or city must contain at least 2 characters.", phone: "Enter your phone number.", phoneInvalid: "Enter a valid phone number.", photos: "Add at least one furniture photo.", comment: "Comment must be up to 500 characters.", submit: "Could not submit the request." }
    },
    upload: { label: "Furniture photos", add: "Add up to 6 photos", formats: "JPG, PNG or WEBP up to 10 MB each", tip: "Best options: full view, a close-up of the stain and the fabric tag, if available.", remove: "Remove" },
    success: { close: "Close", title: "Thank you! The form is complete.", text: "The details have been checked.", ok: "Done" },
    footer: "Furniture cleaning in Kyiv with a photo estimate.",
    services: [
      { value: "sofa", label: "Sofa", price: "from UAH 900", note: "2-3 seats, fabric or velour" },
      { value: "mattress", label: "Mattress", price: "from UAH 800", note: "stains, dust, odors and refreshing" },
      { value: "armchair", label: "Armchair", price: "from UAH 450", note: "home and office armchairs" },
      { value: "chairs", label: "Chairs", price: "from UAH 120", note: "per upholstered chair" },
      { value: "carpet", label: "Carpet", price: "from UAH 90/m²", note: "pile rugs, runners and fitted carpets" },
      { value: "car_interior", label: "Car interior", price: "from UAH 1800", note: "seats, flooring and trunk" }
    ]
  }
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
