"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { WizardStepScreen } from "@/components/onboarding/WizardStepScreen";
import { FamilyForm } from "@/components/profile-sections/FamilyForm";
import { useOwnFamily, useSaveFamily } from "@/hooks/useFamily";
import { useOwnProfile } from "@/hooks/useProfile";
import { FamilyFormValues, familySchema } from "@/lib/validation/familySchema";

const emptyDefaults: FamilyFormValues = {
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  siblingsCount: "",
  familyType: undefined,
  familyValues: undefined,
};

export default function FamilyPage() {
  const router = useRouter();
  const { data: existing } = useOwnFamily();
  const { data: profile } = useOwnProfile();
  const saveMutation = useSaveFamily();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    try {
      await saveMutation.mutateAsync(values);
      router.push("/onboarding/preferences");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <WizardStepScreen
      stepKey="family"
      gender={profile?.gender}
      onBack={() => router.back()}
      onContinue={onSubmit}
      continueDisabled={saveMutation.isPending}
      continueError={submitError}
    >
      <FamilyForm control={control} />
    </WizardStepScreen>
  );
}
