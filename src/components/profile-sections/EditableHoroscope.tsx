"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useOwnHoroscope, useSaveHoroscope } from "@/hooks/useHoroscope";
import { HoroscopeFormValues, horoscopeSchema } from "@/lib/validation/horoscopeSchema";
import { HoroscopeForm } from "./HoroscopeForm";
import { SaveBar } from "./SaveBar";

const emptyDefaults: HoroscopeFormValues = {
  star: "",
  raasi: "",
  lagnam: "",
  chevvaiDosham: false,
  birthPlace: "",
  horoscopeImageUrl: "",
};

export function EditableHoroscope() {
  const { data: existing } = useOwnHoroscope();
  const saveMutation = useSaveHoroscope();
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit, reset } = useForm<HoroscopeFormValues>({
    resolver: zodResolver(horoscopeSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing) {
      reset({
        star: existing.star ?? "",
        raasi: existing.raasi ?? "",
        lagnam: existing.lagnam ?? "",
        chevvaiDosham: existing.chevvai_dosham,
        birthPlace: existing.birth_place ?? "",
        horoscopeImageUrl: existing.horoscope_image_url ?? "",
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
      <HoroscopeForm control={control} />
      <SaveBar onSave={onSubmit} saving={saveMutation.isPending} saved={saved} error={saveMutation.error} />
    </>
  );
}
