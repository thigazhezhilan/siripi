"use client";

import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormSelectField } from "@/components/form/FormSelectField";
import { FormTextField } from "@/components/form/FormTextField";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PersonalDetailsFormValues,
  RELATION_OPTIONS,
} from "@/lib/validation/personalDetailsSchema";

export function PersonalDetailsForm({ control }: { control: Control<PersonalDetailsFormValues> }) {
  const { t } = useTranslation();

  return (
    <>
      <FormTextField
        control={control}
        name="fullName"
        label={t("onboarding.personal.fullName")}
        placeholder={t("onboarding.personal.fullNamePlaceholder")}
      />
      <FormSelectField
        control={control}
        name="gender"
        label={t("onboarding.personal.gender")}
        options={GENDER_OPTIONS.map((value) => ({
          value,
          label: t(`onboarding.personal.gender${capitalize(value)}`),
        }))}
      />
      <FormTextField
        control={control}
        name="dateOfBirth"
        label={t("onboarding.personal.dateOfBirth")}
        placeholder="YYYY-MM-DD"
      />
      <FormTextField
        control={control}
        name="timeOfBirth"
        label={t("onboarding.personal.timeOfBirthOptional")}
        placeholder="HH:MM"
      />
      <FormSelectField
        control={control}
        name="profileOwnerRelation"
        label={t("onboarding.personal.profileOwnerRelation")}
        options={RELATION_OPTIONS.map((value) => ({
          value,
          label: t(`onboarding.personal.relation${capitalize(value)}`),
        }))}
      />
      <FormSelectField
        control={control}
        name="maritalStatus"
        label={t("onboarding.personal.maritalStatus")}
        options={MARITAL_STATUS_OPTIONS.map((value) => ({
          value,
          label: t(`onboarding.personal.marital${toPascalCase(value)}`),
        }))}
      />
      <FormTextField
        control={control}
        name="heightCm"
        label={t("onboarding.personal.height")}
        inputMode="numeric"
        optionalLabel
      />
      <FormTextField
        control={control}
        name="motherTongue"
        label={t("onboarding.personal.motherTongue")}
        optionalLabel
      />
      <FormTextField control={control} name="religion" label={t("onboarding.personal.religion")} optionalLabel />
      <FormTextField control={control} name="caste" label={t("onboarding.personal.caste")} optionalLabel />
      <FormTextField control={control} name="subCaste" label={t("onboarding.personal.subCaste")} optionalLabel />
      <FormTextField control={control} name="education" label={t("onboarding.personal.education")} optionalLabel />
      <FormTextField control={control} name="occupation" label={t("onboarding.personal.occupation")} optionalLabel />
      <FormTextField
        control={control}
        name="annualIncomeRange"
        label={t("onboarding.personal.annualIncome")}
        optionalLabel
      />
      <FormTextField control={control} name="city" label={t("onboarding.personal.city")} />
      <FormTextField control={control} name="district" label={t("onboarding.personal.district")} optionalLabel />
      <FormTextField control={control} name="state" label={t("onboarding.personal.state")} optionalLabel />
      <FormTextField control={control} name="country" label={t("onboarding.personal.country")} optionalLabel />
      <FormTextField
        control={control}
        name="aboutMeEn"
        label={t("onboarding.personal.aboutMeEn")}
        optionalLabel
        multiline
        numberOfLines={3}
      />
      <FormTextField
        control={control}
        name="aboutMeTa"
        label={t("onboarding.personal.aboutMeTa")}
        optionalLabel
        multiline
        numberOfLines={3}
      />
    </>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toPascalCase(value: string): string {
  return value
    .split("_")
    .map((part) => capitalize(part))
    .join("");
}
