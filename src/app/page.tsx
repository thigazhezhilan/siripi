"use client";

import { Noto_Sans_Tamil } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { setLanguage, type SupportedLanguage } from "@/lib/i18n";

const notoSansTamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "700"] });

export default function LanguageSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleSelect(language: SupportedLanguage) {
    setLanguage(language);
    router.push("/auth");
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sirpi-bg to-sirpi-surface px-6 py-16">
      {/* Kolam-inspired dot backdrop — subtle traditional Tamil motif, kept very low opacity */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.05,
          backgroundImage: "radial-gradient(circle, var(--color-sirpi-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm text-center">
        {/* Logo — the sculptor-figure mark, cropped from the source lockup with its background removed */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-icon.png"
            alt={t("common.appName", { lng: "ta" })}
            width={146}
            height={250}
            priority
            className="h-20 w-auto drop-shadow-sm"
          />
        </div>

        {/* App name — Tamil primary, English subtitle beneath */}
        <h1 className={`${notoSansTamil.className} text-4xl font-bold tracking-tight text-sirpi-primary`}>
          {t("common.appName", { lng: "ta" })}
        </h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-sirpi-muted">
          {t("languageSelect.appFullName", { lng: "en" })}
        </p>

        {/* Gold divider */}
        <div className="mx-auto my-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent" />

        {/* Welcome tagline — bilingual and hardcoded to both languages, since no language has been chosen yet */}
        <p className={`${notoSansTamil.className} text-lg font-semibold text-sirpi-text`}>
          {t("languageSelect.welcome", { lng: "ta" })}
        </p>
        <p className="mt-1 text-sm text-sirpi-muted">{t("languageSelect.welcome", { lng: "en" })}</p>

        {/* Instruction — distinct from the welcome line above, still follows the active locale as before */}
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-sirpi-muted">
          {t("languageSelect.title")}
        </p>

        <div className="mt-4 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            className="w-full rounded-2xl border border-sirpi-primary/20 bg-sirpi-surface py-4 text-base font-bold text-sirpi-primary shadow-sm transition hover:border-sirpi-primary/40 hover:shadow-md"
          >
            {t("languageSelect.english")}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("ta")}
            className={`${notoSansTamil.className} w-full rounded-2xl border border-sirpi-primary/20 bg-sirpi-surface py-4 text-base font-bold text-sirpi-primary shadow-sm transition hover:border-sirpi-primary/40 hover:shadow-md`}
          >
            {t("languageSelect.tamil")}
          </button>
        </div>

        <p className="mt-6 text-xs text-sirpi-muted">{t("languageSelect.subtitle")}</p>
      </div>
    </div>
  );
}
