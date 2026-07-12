"use client";

import { useTranslation } from "react-i18next";

import { AccordionPanel } from "@/components/profile-sections/AccordionPanel";
import { EditableFamily } from "@/components/profile-sections/EditableFamily";
import { EditableHoroscope } from "@/components/profile-sections/EditableHoroscope";
import { EditablePersonalDetails } from "@/components/profile-sections/EditablePersonalDetails";
import { EditablePreferences } from "@/components/profile-sections/EditablePreferences";
import { PhotosSection } from "@/components/profile-sections/PhotosSection";
import { useOwnProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: profile } = useOwnProfile();
  const showPhotos = profile?.gender !== "female";

  return (
    <div className="mx-auto w-full max-w-xl bg-sirpi-bg p-6 pb-8">
      <h1 className="mb-4 text-2xl font-bold text-sirpi-text">{t("profileTab.title")}</h1>

      <AccordionPanel title={t("onboarding.steps.personal")} defaultExpanded>
        <EditablePersonalDetails />
      </AccordionPanel>

      {showPhotos ? (
        <AccordionPanel title={t("onboarding.steps.photos")}>
          <PhotosSection />
        </AccordionPanel>
      ) : null}

      <AccordionPanel title={t("onboarding.steps.horoscope")}>
        <EditableHoroscope />
      </AccordionPanel>

      <AccordionPanel title={t("onboarding.steps.family")}>
        <EditableFamily />
      </AccordionPanel>

      <AccordionPanel title={t("onboarding.steps.preferences")}>
        <EditablePreferences />
      </AccordionPanel>
    </div>
  );
}
