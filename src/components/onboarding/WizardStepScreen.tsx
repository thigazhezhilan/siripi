"use client";

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { OnboardingStepKey } from "@/constants/onboarding";
import { WizardProgress } from "./WizardProgress";

type Props = {
  stepKey: OnboardingStepKey;
  gender?: string;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueError?: string | null;
};

export function WizardStepScreen({
  stepKey,
  gender,
  children,
  onContinue,
  onBack,
  continueLabel,
  continueDisabled,
  continueError,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-sirpi-bg">
      <div className="flex-1 overflow-y-auto p-6 pb-8">
        <div className="mx-auto w-full max-w-xl">
          <WizardProgress stepKey={stepKey} gender={gender} />
          {children}
        </div>
      </div>
      <div className="border-t border-sirpi-border bg-sirpi-bg p-6">
        <div className="mx-auto w-full max-w-xl">
          {continueError ? (
            <p className="mb-3 text-center text-sm text-sirpi-primary">{continueError}</p>
          ) : null}
          <div className="flex gap-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex-1 rounded-lg border border-sirpi-border py-3 text-sm font-bold text-sirpi-text transition-transform duration-100 active:scale-[0.96]"
              >
                {t("common.back")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className="flex-[2] rounded-lg bg-sirpi-primary py-3 text-sm font-bold text-white transition-transform duration-100 disabled:opacity-50 enabled:active:scale-[0.96]"
            >
              {continueLabel ?? t("common.continue")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
