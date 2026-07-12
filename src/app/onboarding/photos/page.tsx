"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { WizardStepScreen } from "@/components/onboarding/WizardStepScreen";
import { PhotosSection } from "@/components/profile-sections/PhotosSection";
import { useOwnPhotos } from "@/hooks/usePhotos";
import { useOwnProfile } from "@/hooks/useProfile";

export default function PhotosPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: photos = [] } = useOwnPhotos();
  const { data: profile } = useOwnProfile();

  // Defensive: this step should never be reachable for female profiles (the
  // personal-details step routes around it), but guard direct/deep-link access.
  useEffect(() => {
    if (profile?.gender === "female") {
      router.replace("/onboarding/horoscope");
    }
  }, [profile, router]);

  return (
    <WizardStepScreen
      stepKey="photos"
      gender={profile?.gender}
      onBack={() => router.back()}
      onContinue={() => router.push("/onboarding/horoscope")}
      continueDisabled={photos.length === 0}
      continueError={photos.length === 0 ? t("onboarding.photos.atLeastOneRequired") : null}
    >
      <PhotosSection />
    </WizardStepScreen>
  );
}
