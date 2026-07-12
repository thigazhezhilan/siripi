"use client";

import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormTextField } from "@/components/form/FormTextField";
import { PreferencesFormValues } from "@/lib/validation/preferencesSchema";

export function PreferencesForm({ control }: { control: Control<PreferencesFormValues> }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-4">
        <div className="flex-1">
          <FormTextField
            control={control}
            name="ageMin"
            label={t("onboarding.preferences.ageMin")}
            inputMode="numeric"
            optionalLabel
          />
        </div>
        <div className="flex-1">
          <FormTextField
            control={control}
            name="ageMax"
            label={t("onboarding.preferences.ageMax")}
            inputMode="numeric"
            optionalLabel
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <FormTextField
            control={control}
            name="heightMinCm"
            label={t("onboarding.preferences.heightMin")}
            inputMode="numeric"
            optionalLabel
          />
        </div>
        <div className="flex-1">
          <FormTextField
            control={control}
            name="heightMaxCm"
            label={t("onboarding.preferences.heightMax")}
            inputMode="numeric"
            optionalLabel
          />
        </div>
      </div>
      <FormTextField
        control={control}
        name="preferredReligion"
        label={t("onboarding.preferences.preferredReligion")}
        placeholder="Hindu, Christian, ..."
        optionalLabel
      />
      <FormTextField
        control={control}
        name="preferredCaste"
        label={t("onboarding.preferences.preferredCaste")}
        optionalLabel
      />
      <FormTextField
        control={control}
        name="preferredEducation"
        label={t("onboarding.preferences.preferredEducation")}
        optionalLabel
      />
      <FormTextField
        control={control}
        name="preferredLocation"
        label={t("onboarding.preferences.preferredLocation")}
        optionalLabel
      />
    </>
  );
}
