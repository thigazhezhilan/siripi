import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ta from "./locales/ta.json";

export const SUPPORTED_LANGUAGES = ["en", "ta"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = "sirpi.language";

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : null;
}

export function setLanguage(language: SupportedLanguage): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
  void i18n.changeLanguage(language);
}

function detectBrowserLanguage(): SupportedLanguage {
  const browserLanguageCode =
    typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en";
  return isSupportedLanguage(browserLanguageCode) ? browserLanguageCode : "en";
}

let initialized = false;

export function initI18n(): typeof i18n {
  if (!initialized) {
    initialized = true;
    const storedLanguage = getStoredLanguage();
    void i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        ta: { translation: ta },
      },
      lng: storedLanguage ?? detectBrowserLanguage(),
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  }
  return i18n;
}

export default i18n;
