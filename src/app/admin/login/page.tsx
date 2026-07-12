"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormTextField } from "@/components/form/FormTextField";
import { useIsAdmin } from "@/hooks/useAdmin";
import { signInAdmin } from "@/lib/auth/adminAuth";
import { AdminLoginFormValues, adminLoginSchema } from "@/lib/validation/adminAuthSchema";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: isAdmin } = useIsAdmin();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAdmin) {
      router.replace("/admin");
    }
  }, [isAdmin, router]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await signInAdmin(email, password);
      router.replace("/admin");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex flex-1 flex-col justify-center bg-sirpi-bg px-6 py-32">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-sirpi-text">{t("admin.login.title")}</h1>
        <p className="mb-8 text-sm text-sirpi-muted">{t("admin.login.subtitle")}</p>

        <form onSubmit={onSubmit}>
          <FormTextField
            control={control}
            name="email"
            label={t("admin.login.emailLabel")}
            placeholder={t("admin.login.emailPlaceholder")}
            type="email"
            autoCapitalize="none"
            autoFocus
          />
          <FormTextField
            control={control}
            name="password"
            label={t("admin.login.passwordLabel")}
            type="password"
          />

          {submitError ? (
            <p className="mb-2 text-sm text-sirpi-primary">{submitError}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-sirpi-primary py-4 text-base font-bold text-white disabled:opacity-60"
          >
            {submitting ? t("common.loading") : t("admin.login.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
