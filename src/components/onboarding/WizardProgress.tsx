"use client";

import { useTranslation } from "react-i18next";

import { getOnboardingSteps, OnboardingStepKey } from "@/constants/onboarding";

export function WizardProgress({ stepKey, gender }: { stepKey: OnboardingStepKey; gender?: string }) {
  const { t } = useTranslation();
  const steps = getOnboardingSteps(gender);
  const stepIndex = steps.findIndex((s) => s.key === stepKey);
  const step = steps[stepIndex];

  return (
    <div className="mb-6">
      <p className="text-xs text-sirpi-muted">
        {t("common.step")} {stepIndex + 1} / {steps.length}
      </p>
      <h1 className="mt-1 mb-2 text-xl font-bold text-sirpi-text">{t(step.titleKey)}</h1>
      <div className="flex gap-1">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-sirpi-primary" : "bg-sirpi-border"}`}
          />
        ))}
      </div>
    </div>
  );
}
