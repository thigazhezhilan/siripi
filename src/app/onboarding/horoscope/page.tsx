"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { WizardStepScreen } from "@/components/onboarding/WizardStepScreen";
import { HoroscopeForm } from "@/components/profile-sections/HoroscopeForm";
import { useOwnHoroscope, useSaveHoroscope } from "@/hooks/useHoroscope";
import { useOwnProfile } from "@/hooks/useProfile";
import { HoroscopeFormValues, horoscopeSchema } from "@/lib/validation/horoscopeSchema";

const emptyDefaults: HoroscopeFormValues = {
  star: "",
  raasi: "",
  lagnam: "",
  chevvaiDosham: false,
  birthPlace: "",
  horoscopeImageUrl: "",
};

export default function HoroscopePage() {
  const router = useRouter();
  const { data: existing } = useOwnHoroscope();
  const { data: profile } = useOwnProfile();
  const saveMutation = useSaveHoroscope();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    try {
      await saveMutation.mutateAsync(values);
      router.push("/onboarding/family");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <WizardStepScreen
      stepKey="horoscope"
      gender={profile?.gender}
      onBack={() => router.back()}
      onContinue={onSubmit}
      continueDisabled={saveMutation.isPending}
      continueError={submitError}
    >
      <HoroscopeForm control={control} />
    </WizardStepScreen>
  );
}
