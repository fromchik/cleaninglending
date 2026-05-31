import { createContext, PropsWithChildren, useContext, useEffect } from "react";

export type Locale = "ua" | "en";

const LocaleContext = createContext<Locale>("ua");

function getLocaleFromPath(): Locale {
  return window.location.pathname.split("/")[1] === "en" ? "en" : "ua";
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const locale = getLocaleFromPath();

  useEffect(() => {
    document.documentElement.lang = locale === "ua" ? "uk" : "en";
    document.title =
      locale === "ua"
        ? "Хімчистка меблів у Києві з розрахунком за фото"
        : "Furniture cleaning in Kyiv with a photo estimate";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        locale === "ua"
          ? "Хімчистка меблів у Києві з розрахунком за фото: дивани, матраци, крісла, стільці, килими та автосалони."
          : "Furniture cleaning in Kyiv with a photo estimate: sofas, mattresses, armchairs, chairs, carpets and car interiors."
      );
  }, [locale]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function localize<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale];
}
