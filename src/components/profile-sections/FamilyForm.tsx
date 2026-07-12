"use client";

import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormSelectField } from "@/components/form/FormSelectField";
import { FormTextField } from "@/components/form/FormTextField";
import { FAMILY_TYPE_OPTIONS, FAMILY_VALUES_OPTIONS, FamilyFormValues } from "@/lib/validation/familySchema";

export function FamilyForm({ control }: { control: Control<FamilyFormValues> }) {
  const { t } = useTranslation();

  return (
    <>
      <FormTextField control={control} name="fatherName" label={t("onboarding.family.fatherName")} optionalLabel />
      <FormTextField
        control={control}
        name="fatherOccupation"
        label={t("onboarding.family.fatherOccupation")}
        optionalLabel
      />
      <FormTextField control={control} name="motherName" label={t("onboarding.family.motherName")} optionalLabel />
      <FormTextField
        control={control}
        name="motherOccupation"
        label={t("onboarding.family.motherOccupation")}
        optionalLabel
      />
      <FormTextField
        control={control}
        name="siblingsCount"
        label={t("onboarding.family.siblingsCount")}
        inputMode="numeric"
        optionalLabel
      />
      <FormSelectField
        control={control}
        name="familyType"
        label={t("onboarding.family.familyType")}
        options={FAMILY_TYPE_OPTIONS.map((value) => ({
          value,
          label: t(`onboarding.family.familyType${capitalize(value)}`),
        }))}
        optionalLabel
      />
      <FormSelectField
        control={control}
        name="familyValues"
        label={t("onboarding.family.familyValues")}
        options={FAMILY_VALUES_OPTIONS.map((value) => ({
          value,
          label: t(`onboarding.family.familyValues${capitalize(value)}`),
        }))}
        optionalLabel
      />
    </>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
