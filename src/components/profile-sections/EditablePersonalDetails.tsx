"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useOwnProfile, useSavePersonalDetails } from "@/hooks/useProfile";
import { PersonalDetailsFormValues, personalDetailsSchema } from "@/lib/validation/personalDetailsSchema";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { SaveBar } from "./SaveBar";

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

export function EditablePersonalDetails() {
  const { data: existingProfile } = useOwnProfile();
  const saveMutation = useSavePersonalDetails();
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
    await saveMutation.mutateAsync(values);
    setSaved(true);
  });

  return (
    <>
      <PersonalDetailsForm control={control} />
      <SaveBar onSave={onSubmit} saving={saveMutation.isPending} saved={saved} error={saveMutation.error} />
    </>
  );
}
