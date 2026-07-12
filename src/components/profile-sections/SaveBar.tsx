"use client";

import { useTranslation } from "react-i18next";

type Props = {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  error?: unknown;
};

export function SaveBar({ onSave, saving, saved, error }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mt-2">
      {error ? (
        <p className="mb-1 text-center text-xs text-sirpi-primary">
          {error instanceof Error ? error.message : String(error)}
        </p>
      ) : null}
      {saved && !saving ? (
        <p className="mb-1 text-center text-xs text-sirpi-primary">{t("profileTab.saved")}</p>
      ) : null}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full rounded-lg bg-sirpi-primary py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? t("common.loading") : t("common.save")}
      </button>
    </div>
  );
}
