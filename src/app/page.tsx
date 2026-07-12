"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { setLanguage, type SupportedLanguage } from "@/lib/i18n";

export default function LanguageSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleSelect(language: SupportedLanguage) {
    setLanguage(language);
    router.push("/auth");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-sirpi-bg px-6 py-32">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-sirpi-text">
          {t("languageSelect.title")}
        </h1>
        <p className="mt-2 mb-8 text-sm text-sirpi-muted">
          {t("languageSelect.subtitle")}
        </p>

        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            className="w-full rounded-xl border border-sirpi-border bg-sirpi-surface py-4 text-base font-bold text-sirpi-primary"
          >
            {t("languageSelect.english")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("ta")}
            className="w-full rounded-xl border border-sirpi-border bg-sirpi-surface py-4 text-base font-bold text-sirpi-primary"
          >
            {t("languageSelect.tamil")}
          </button>
        </div>
      </div>
    </div>
  );
}
