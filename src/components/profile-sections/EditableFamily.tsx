"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useOwnFamily, useSaveFamily } from "@/hooks/useFamily";
import { FamilyFormValues, familySchema } from "@/lib/validation/familySchema";
import { FamilyForm } from "./FamilyForm";
import { SaveBar } from "./SaveBar";

const emptyDefaults: FamilyFormValues = {
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  siblingsCount: "",
  familyType: undefined,
  familyValues: undefined,
};

export function EditableFamily() {
  const { data: existing } = useOwnFamily();
  const saveMutation = useSaveFamily();
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit, reset } = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing) {
      reset({
        fatherName: existing.father_name ?? "",
        fatherOccupation: existing.father_occupation ?? "",
        motherName: existing.mother_name ?? "",
        motherOccupation: existing.mother_occupation ?? "",
        siblingsCount: existing.siblings_count ? String(existing.siblings_count) : "",
        familyType: (existing.family_type as FamilyFormValues["familyType"]) ?? undefined,
        familyValues: (existing.family_values as FamilyFormValues["familyValues"]) ?? undefined,
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
      <FamilyForm control={control} />
      <SaveBar onSave={onSubmit} saving={saveMutation.isPending} saved={saved} error={saveMutation.error} />
    </>
  );
}
