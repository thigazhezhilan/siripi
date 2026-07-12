"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormTextField } from "@/components/form/FormTextField";
import { devLoginWithPhone } from "@/lib/auth/devLogin";
import { PhoneFormValues, phoneSchema } from "@/lib/validation/authSchema";

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const onSubmit = handleSubmit(async ({ phoneNumber }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { hasProfile, isActive } = await devLoginWithPhone(phoneNumber);
      if (hasProfile && isActive) {
        router.replace("/profile");
      } else {
        router.replace("/onboarding/personal");
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
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
