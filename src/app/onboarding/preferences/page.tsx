"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WizardStepScreen } from "@/components/onboarding/WizardStepScreen";
import { PreferencesForm } from "@/components/profile-sections/PreferencesForm";
import { useFinalizeProfile, useOwnProfile } from "@/hooks/useProfile";
import { useOwnPreferences, useSavePreferences } from "@/hooks/usePreferences";
import { PreferencesFormValues, preferencesSchema } from "@/lib/validation/preferencesSchema";

const emptyDefaults: PreferencesFormValues = {
  ageMin: "",
  ageMax: "",
  heightMinCm: "",
  heightMaxCm: "",
  preferredReligion: "",
  preferredCaste: "",
  preferredEducation: "",
  preferredLocation: "",
};

export default function PreferencesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: existing } = useOwnPreferences();
  const { data: profile } = useOwnProfile();
  const saveMutation = useSavePreferences();
  const finalizeMutation = useFinalizeProfile();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing) {
      reset({
        ageMin: existing.age_min ? String(existing.age_min) : "",
        ageMax: existing.age_max ? String(existing.age_max) : "",
        heightMinCm: existing.height_min_cm ? String(existing.height_min_cm) : "",
        heightMaxCm: existing.height_max_cm ? String(existing.height_max_cm) : "",
        preferredReligion: existing.preferred_religion?.join(", ") ?? "",
        preferredCaste: existing.preferred_caste?.join(", ") ?? "",
        preferredEducation: existing.preferred_education?.join(", ") ?? "",
        preferredLocation: existing.preferred_location?.join(", ") ?? "",
      });
    }
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await saveMutation.mutateAsync(values);
      await finalizeMutation.mutateAsync();
      router.replace("/thank-you");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <WizardStepScreen
      stepKey="preferences"
      gender={profile?.gender}
      onBack={() => router.back()}
      onContinue={onSubmit}
      continueLabel={t("onboarding.preferences.finish")}
      continueDisabled={saveMutation.isPending || finalizeMutation.isPending}
      continueError={submitError}
    >
      <PreferencesForm control={control} />
    </WizardStepScreen>
  );
}
