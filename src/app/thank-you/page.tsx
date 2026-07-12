"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ThankYouPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-sirpi-bg px-6 py-32 text-center">
      <h1 className="mb-2 text-2xl font-bold text-sirpi-text">{t("thankYou.title")}</h1>
      <p className="mb-8 max-w-sm text-[15px] text-sirpi-muted">{t("thankYou.subtitle")}</p>

      <button
        type="button"
        onClick={() => router.replace("/profile")}
        className="rounded-lg bg-sirpi-primary px-8 py-3 text-sm font-bold text-white"
      >
        {t("thankYou.viewProfile")}
      </button>
    </div>
  );
}
