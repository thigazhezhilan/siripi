"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormTextField } from "@/components/form/FormTextField";
import { signInOrSignUpWithPhone } from "@/lib/auth/phoneAuth";
import { PhoneAuthFormValues, phoneAuthSchema } from "@/lib/validation/authSchema";

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<PhoneAuthFormValues>({
    resolver: zodResolver(phoneAuthSchema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  const onSubmit = handleSubmit(async ({ phoneNumber, password }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { hasProfile, isActive } = await signInOrSignUpWithPhone(phoneNumber, password);
      if (hasProfile && isActive) {
        router.replace("/profile");
      } else {
        router.replace("/onboarding/personal");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message === "auth.incorrectPassword" ? t("auth.incorrectPassword") : message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex flex-1 flex-col justify-center bg-sirpi-bg px-6 py-32">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-sirpi-text">{t("auth.title")}</h1>
        <p className="mb-8 text-sm text-sirpi-muted">{t("auth.subtitle")}</p>

        <form onSubmit={onSubmit}>
          <FormTextField
            control={control}
            name="phoneNumber"
            label={t("auth.phoneLabel")}
            placeholder={t("auth.phonePlaceholder")}
            type="tel"
            autoFocus
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-sirpi-text">
                  {t("auth.passwordLabel")}
                </label>
                <div
                  className={`flex items-center rounded-lg border bg-sirpi-surface transition-colors duration-150 ${
                    error ? "border-sirpi-primary" : "border-sirpi-border"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    placeholder={t("auth.passwordPlaceholder")}
                    className="w-full rounded-lg bg-transparent px-4 py-2 text-base text-sirpi-text outline-none placeholder:text-sirpi-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="shrink-0 px-3 text-xs font-semibold text-sirpi-primary"
                  >
                    {showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  </button>
                </div>
                {error?.message ? <p className="mt-1 text-xs text-sirpi-primary">{t(error.message)}</p> : null}
              </div>
            )}
          />

          {submitError ? (
            <p className="mb-2 text-sm text-sirpi-primary">{submitError}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-sirpi-primary py-4 text-base font-bold text-white disabled:opacity-60"
          >
            {submitting ? t("common.loading") : t("common.continue")}
          </button>
        </form>
      </div>
    </div>
  );
}
