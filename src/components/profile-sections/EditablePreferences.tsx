"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useOwnPreferences, useSavePreferences } from "@/hooks/usePreferences";
import { PreferencesFormValues, preferencesSchema } from "@/lib/validation/preferencesSchema";
import { PreferencesForm } from "./PreferencesForm";
import { SaveBar } from "./SaveBar";

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

export function EditablePreferences() {
  const { data: existing } = useOwnPreferences();
  const saveMutation = useSavePreferences();
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
    await saveMutation.mutateAsync(values);
    setSaved(true);
  });

  return (
    <>
      <PreferencesForm control={control} />
      <SaveBar onSave={onSubmit} saving={saveMutation.isPending} saved={saved} error={saveMutation.error} />
    </>
  );
}
