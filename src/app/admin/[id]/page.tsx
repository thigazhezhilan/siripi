"use client";

import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  AdminContactStatus,
  useAdminProfileDetail,
  useIsAdmin,
  useUpdateAdminStatus,
} from "@/hooks/useAdmin";
import { photoPublicUrl } from "@/hooks/usePhotos";
import { computeAge } from "@/lib/utils/age";

const STATUS_OPTIONS: AdminContactStatus[] = ["not_contacted", "contacted", "matched", "closed"];

export default function AdminProfileDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: detail, isLoading } = useAdminProfileDetail(id);
  const updateStatus = useUpdateAdminStatus();

  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      router.replace("/admin/login");
    }
  }, [isAdmin, isAdminLoading, router]);

  if (isAdminLoading || !isAdmin || isLoading || !detail) {
    return (
      <div className="flex flex-1 items-center justify-center bg-sirpi-bg py-32">
        <p className="text-sm text-sirpi-muted">{t("common.loading")}</p>
      </div>
    );
  }

  const { profile, horoscope, family, preferences, photos, adminStatus } = detail;

  return (
    <div className="mx-auto w-full max-w-2xl bg-sirpi-bg p-6 pb-8">
      {photos.length > 0 ? (
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photoPublicUrl(photo.storage_path)}
              alt=""
              className="h-[240px] w-[200px] shrink-0 rounded-xl bg-sirpi-surface object-cover"
            />
          ))}
        </div>
      ) : (
        <p className="mb-2 text-[13px] text-sirpi-muted">{t("admin.detail.noPhoto")}</p>
      )}

      <h1 className="mt-2 text-2xl font-bold text-sirpi-text">{profile.full_name}</h1>
      <p className="mb-4 text-sm text-sirpi-muted">
        {profile.gender} • {computeAge(profile.date_of_birth)} • {profile.city}
      </p>

      <div className="mb-4 rounded-lg bg-sirpi-surface p-4">
        <p className="text-[13px] text-sirpi-muted">{t("admin.detail.phoneNumber")}</p>
        <p className="mt-1 text-lg font-bold text-sirpi-primary">
          {profile.phone_number ?? t("common.notSet")}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-[13px] text-sirpi-muted">{t("admin.detail.contactStatus")}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateStatus.mutate({ profileId: profile.id, status })}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                adminStatus === status
                  ? "border-sirpi-primary bg-sirpi-primary font-bold text-white"
                  : "border-sirpi-border bg-sirpi-surface text-sirpi-text"
              }`}
            >
              {t(`admin.detail.status${toPascalCase(status)}`)}
            </button>
          ))}
        </div>
      </div>

      <Section title={t("onboarding.personal.title")}>
        <FieldRow label={t("onboarding.personal.maritalStatus")} value={profile.marital_status} />
        <FieldRow label={t("onboarding.personal.height")} value={profile.height_cm?.toString()} />
        <FieldRow label={t("onboarding.personal.motherTongue")} value={profile.mother_tongue} />
        <FieldRow label={t("onboarding.personal.religion")} value={profile.religion} />
        <FieldRow label={t("onboarding.personal.caste")} value={profile.caste} />
        <FieldRow label={t("onboarding.personal.subCaste")} value={profile.sub_caste} />
        <FieldRow label={t("onboarding.personal.education")} value={profile.education} />
        <FieldRow label={t("onboarding.personal.occupation")} value={profile.occupation} />
        <FieldRow label={t("onboarding.personal.annualIncome")} value={profile.annual_income_range} />
        <FieldRow label={t("onboarding.personal.district")} value={profile.district} />
        <FieldRow label={t("onboarding.personal.state")} value={profile.state} />
        <FieldRow label="EN" value={profile.about_me_en} />
        <FieldRow label="தமிழ்" value={profile.about_me_ta} />
      </Section>

      {horoscope ? (
        <Section title={t("profileDetail.horoscope")}>
          <FieldRow label={t("onboarding.horoscope.star")} value={horoscope.star} />
          <FieldRow label={t("onboarding.horoscope.raasi")} value={horoscope.raasi} />
          <FieldRow label={t("onboarding.horoscope.lagnam")} value={horoscope.lagnam} />
          <FieldRow label={t("onboarding.horoscope.birthPlace")} value={horoscope.birth_place} />
          <FieldRow
            label={t("onboarding.horoscope.chevvaiDosham")}
            value={horoscope.chevvai_dosham ? t("common.yes") : t("common.no")}
          />
        </Section>
      ) : null}

      {family ? (
        <Section title={t("profileDetail.family")}>
          <FieldRow label={t("onboarding.family.fatherName")} value={family.father_name} />
          <FieldRow label={t("onboarding.family.fatherOccupation")} value={family.father_occupation} />
          <FieldRow label={t("onboarding.family.motherName")} value={family.mother_name} />
          <FieldRow label={t("onboarding.family.motherOccupation")} value={family.mother_occupation} />
          <FieldRow label={t("onboarding.family.siblingsCount")} value={family.siblings_count?.toString()} />
          <FieldRow label={t("onboarding.family.familyType")} value={family.family_type} />
          <FieldRow label={t("onboarding.family.familyValues")} value={family.family_values} />
        </Section>
      ) : null}

      {preferences ? (
        <Section title={t("profileDetail.partnerPreferences")}>
          <FieldRow
            label={t("onboarding.preferences.ageRange")}
            value={
              preferences.age_min || preferences.age_max
                ? `${preferences.age_min ?? "-"} - ${preferences.age_max ?? "-"}`
                : null
            }
          />
          <FieldRow
            label={t("onboarding.preferences.preferredReligion")}
            value={preferences.preferred_religion?.join(", ")}
          />
          <FieldRow
            label={t("onboarding.preferences.preferredEducation")}
            value={preferences.preferred_education?.join(", ")}
          />
          <FieldRow
            label={t("onboarding.preferences.preferredLocation")}
            value={preferences.preferred_location?.join(", ")}
          />
        </Section>
      ) : null}
    </div>
  );
}

function toPascalCase(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4 border-t border-sirpi-border pt-4">
      <p className="mb-2 text-base font-bold text-sirpi-text">{title}</p>
      {children}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value?: string | null }) {
  const { t } = useTranslation();
  if (!value) return null;
  return (
    <div className="mb-1 flex justify-between">
      <span className="flex-1 text-[13px] text-sirpi-muted">{label}</span>
      <span className="flex-1 text-right text-[13px] text-sirpi-text">{value || t("common.notSet")}</span>
    </div>
  );
}
