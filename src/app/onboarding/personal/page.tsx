"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { PersonalDetailsForm } from "@/components/profile-sections/PersonalDetailsForm";
import { WizardStepScreen } from "@/components/onboarding/WizardStepScreen";
import { useOwnProfile, useSavePersonalDetails } from "@/hooks/useProfile";
import {
  PersonalDetailsFormValues,
  personalDetailsSchema,
} from "@/lib/validation/personalDetailsSchema";

const emptyDefaults: PersonalDetailsFormValues = {
  fullName: "",
  gender: "male",
  dateOfBirth: "",
  timeOfBirth: "",
  profileOwnerRelation: "self",
  maritalStatus: "never_married",
  heightCm: "",
  motherTongue: "",
  religion: "",
  caste: "",
  subCaste: "",
  education: "",
  occupation: "",
  annualIncomeRange: "",
  city: "",
  district: "",
  state: "",
  country: "",
  aboutMeEn: "",
  aboutMeTa: "",
};

export default function PersonalDetailsPage() {
  const router = useRouter();
  const { data: existingProfile } = useOwnProfile();
  const saveMutation = useSavePersonalDetails();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existingProfile) {
      reset({
        fullName: existingProfile.full_name,
        gender: existingProfile.gender as PersonalDetailsFormValues["gender"],
        dateOfBirth: existingProfile.date_of_birth,
        timeOfBirth: existingProfile.time_of_birth ?? "",
        profileOwnerRelation:
          existingProfile.profile_owner_relation as PersonalDetailsFormValues["profileOwnerRelation"],
        maritalStatus: existingProfile.marital_status as PersonalDetailsFormValues["maritalStatus"],
        heightCm: existingProfile.height_cm ? String(existingProfile.height_cm) : "",
        motherTongue: existingProfile.mother_tongue ?? "",
        religion: existingProfile.religion ?? "",
        caste: existingProfile.caste ?? "",
        subCaste: existingProfile.sub_caste ?? "",
        education: existingProfile.education ?? "",
        occupation: existingProfile.occupation ?? "",
        annualIncomeRange: existingProfile.annual_income_range ?? "",
        city: existingProfile.city,
        district: existingProfile.district ?? "",
        state: existingProfile.state ?? "",
        country: existingProfile.country ?? "",
        aboutMeEn: existingProfile.about_me_en ?? "",
        aboutMeTa: existingProfile.about_me_ta ?? "",
      });
    }
  }, [existingProfile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await saveMutation.mutateAsync(values);
      // Photo upload is skipped entirely for female profiles — not shown as a
      // disabled step, just never routed to.
      if (values.gender === "female") {
        router.push("/onboarding/horoscope");
      } else {
        router.push("/onboarding/photos");
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <WizardStepScreen
      stepKey="personal"
      onContinue={onSubmit}
      continueDisabled={saveMutation.isPending}
      continueError={submitError}
    >
      <PersonalDetailsForm control={control} />
    </WizardStepScreen>
  );
}
