"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Noto_Sans_Tamil } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormTextField } from "@/components/form/FormTextField";
import { getStoredLanguage, setLanguage } from "@/lib/i18n";
import { loginWithPhone, registerWithPhone } from "@/lib/auth/phoneAuth";
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
} from "@/lib/validation/authSchema";

const notoSansTamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "700"] });

type Tab = "register" | "login";

function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  t,
}: {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  t: (key: string) => string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-sirpi-text">{label}</label>
          <div
            className={`flex items-center rounded-lg border bg-sirpi-surface transition-colors duration-150 ${
              error ? "border-sirpi-primary" : "border-sirpi-border"
            }`}
          >
            <input
              type={visible ? "text" : "password"}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={t("auth.passwordPlaceholder")}
              className="w-full rounded-lg bg-transparent px-4 py-2 text-base text-sirpi-text outline-none placeholder:text-sirpi-muted"
            />
            <button
              type="button"
              onClick={() => setVisible((prev) => !prev)}
              className="shrink-0 px-3 text-xs font-semibold text-sirpi-primary"
            >
              {visible ? t("auth.hidePassword") : t("auth.showPassword")}
            </button>
          </div>
          {error?.message ? <p className="mt-1 text-xs text-sirpi-primary">{t(error.message)}</p> : null}
        </div>
      )}
    />
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(() => (getStoredLanguage() ? "login" : "register"));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phoneNumber: "", password: "", confirmPassword: "", language: undefined },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  function switchTab(next: Tab) {
    setTab(next);
    setSubmitError(null);
  }

  const onRegister = registerForm.handleSubmit(async ({ phoneNumber, password, language }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registerWithPhone(phoneNumber, password, language);
      setLanguage(language);
      router.replace("/onboarding/personal");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message === "auth.phoneAlreadyRegistered" ? t("auth.phoneAlreadyRegistered") : message);
    } finally {
      setSubmitting(false);
    }
  });

  const onLogin = loginForm.handleSubmit(async ({ phoneNumber, password }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { hasProfile, isActive, preferredLanguage } = await loginWithPhone(phoneNumber, password);
      if (preferredLanguage) setLanguage(preferredLanguage);
      router.replace(hasProfile && isActive ? "/profile" : "/onboarding/personal");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message === "auth.loginFailed" ? t("auth.loginFailed") : message);
    } finally {
      setSubmitting(false);
    }
  });

  const tabButtonClass = (active: boolean) =>
    `flex-1 rounded-xl py-3 text-sm font-bold transition ${
      active ? "bg-sirpi-primary text-white shadow-sm" : "bg-sirpi-surface text-sirpi-muted"
    }`;

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-sirpi-bg to-sirpi-surface px-6 py-16">
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

        {/* Welcome tagline — bilingual and hardcoded to both languages */}
        <p className={`${notoSansTamil.className} text-lg font-semibold text-sirpi-text`}>
          {t("languageSelect.welcome", { lng: "ta" })}
        </p>
        <p className="mt-1 mb-6 text-sm text-sirpi-muted">{t("languageSelect.welcome", { lng: "en" })}</p>

        {/* Tabs */}
        <div className="flex gap-2 rounded-xl bg-sirpi-border/40 p-1">
          <button type="button" onClick={() => switchTab("register")} className={tabButtonClass(tab === "register")}>
            {t("auth.newUserTab")}
          </button>
          <button type="button" onClick={() => switchTab("login")} className={tabButtonClass(tab === "login")}>
            {t("auth.loginTab")}
          </button>
        </div>

        <div className="mt-6 text-left">
          {tab === "register" ? (
            <form key="register" onSubmit={onRegister}>
              <FormTextField
                control={registerForm.control}
                name="phoneNumber"
                label={t("auth.phoneLabel")}
                placeholder={t("auth.phonePlaceholder")}
                type="tel"
                autoFocus
              />
              <PasswordField control={registerForm.control} name="password" label={t("auth.passwordLabel")} t={t} />
              <PasswordField
                control={registerForm.control}
                name="confirmPassword"
                label={t("auth.confirmPasswordLabel")}
                t={t}
              />

              <Controller
                control={registerForm.control}
                name="language"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-sirpi-text">
                      {t("auth.chooseLanguageLabel")}
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => onChange("en")}
                        className={`flex-1 rounded-xl border py-3 text-sm font-bold transition ${
                          value === "en"
                            ? "border-sirpi-primary bg-sirpi-primary text-white"
                            : "border-sirpi-border bg-sirpi-surface text-sirpi-primary"
                        }`}
                      >
                        {t("languageSelect.english")}
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange("ta")}
                        className={`${notoSansTamil.className} flex-1 rounded-xl border py-3 text-sm font-bold transition ${
                          value === "ta"
                            ? "border-sirpi-primary bg-sirpi-primary text-white"
                            : "border-sirpi-border bg-sirpi-surface text-sirpi-primary"
                        }`}
                      >
                        {t("languageSelect.tamil")}
                      </button>
                    </div>
                    {error?.message ? <p className="mt-1 text-xs text-sirpi-primary">{t(error.message)}</p> : null}
                  </div>
                )}
              />

              {submitError ? <p className="mb-2 text-sm text-sirpi-primary">{submitError}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-sirpi-primary py-4 text-base font-bold text-white disabled:opacity-60"
              >
                {submitting ? t("common.loading") : t("auth.registerButton")}
              </button>
            </form>
          ) : (
            <form key="login" onSubmit={onLogin}>
              <FormTextField
                control={loginForm.control}
                name="phoneNumber"
                label={t("auth.phoneLabel")}
                placeholder={t("auth.phonePlaceholder")}
                type="tel"
                autoFocus
              />
              <PasswordField control={loginForm.control} name="password" label={t("auth.passwordLabel")} t={t} />

              {submitError ? <p className="mb-2 text-sm text-sirpi-primary">{submitError}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-sirpi-primary py-4 text-base font-bold text-white disabled:opacity-60"
              >
                {submitting ? t("common.loading") : t("auth.loginButton")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
