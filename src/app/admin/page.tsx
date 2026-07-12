"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAdminProfileList, useIsAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/lib/supabase";
import { computeAge } from "@/lib/utils/age";

const GENDER_OPTIONS = ["male", "female"] as const;

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const [gender, setGender] = useState<string | undefined>(undefined);
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [location, setLocation] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [education, setEducation] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      router.replace("/admin/login");
    }
  }, [isAdmin, isAdminLoading, router]);

  const filters = useMemo(
    () => ({
      gender,
      religion: religion.trim() || undefined,
      caste: caste.trim() || undefined,
      location: location.trim() || undefined,
      maritalStatus: maritalStatus.trim() || undefined,
      education: education.trim() || undefined,
      ageMin: ageMin.trim() ? Number(ageMin.trim()) : undefined,
      ageMax: ageMax.trim() ? Number(ageMax.trim()) : undefined,
    }),
    [gender, religion, caste, location, maritalStatus, education, ageMin, ageMax]
  );

  const { data: profiles = [], isLoading } = useAdminProfileList(filters);

  const clearFilters = () => {
    setGender(undefined);
    setReligion("");
    setCaste("");
    setLocation("");
    setMaritalStatus("");
    setEducation("");
    setAgeMin("");
    setAgeMax("");
  };

  if (isAdminLoading || !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center bg-sirpi-bg py-32">
        <p className="text-sm text-sirpi-muted">{t("common.loading")}</p>
      </div>
    );
  }

  const filterInputClass =
    "mb-2 w-full rounded-lg border border-sirpi-border bg-sirpi-surface px-4 py-2 text-sm text-sirpi-text placeholder:text-sirpi-muted outline-none";

  return (
    <div className="mx-auto w-full max-w-2xl bg-sirpi-bg p-6 pb-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sirpi-text">{t("admin.dashboard.title")}</h1>
        <button
          type="button"
          onClick={() => supabase.auth.signOut().then(() => router.replace("/admin/login"))}
          className="text-sm font-bold text-sirpi-primary"
        >
          {t("admin.dashboard.logout")}
        </button>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(gender === g ? undefined : g)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                gender === g
                  ? "border-sirpi-primary bg-sirpi-primary font-bold text-white"
                  : "border-sirpi-border bg-sirpi-surface text-sirpi-text"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <input
          className={filterInputClass}
          placeholder={t("admin.dashboard.religion")}
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />
        <input
          className={filterInputClass}
          placeholder={t("admin.dashboard.caste")}
          value={caste}
          onChange={(e) => setCaste(e.target.value)}
        />
        <input
          className={filterInputClass}
          placeholder={t("admin.dashboard.location")}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className={filterInputClass}
          placeholder={t("admin.dashboard.maritalStatus")}
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
        />
        <input
          className={filterInputClass}
          placeholder={t("admin.dashboard.education")}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            className={`${filterInputClass} flex-1`}
            placeholder={t("admin.dashboard.ageRange")}
            inputMode="numeric"
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
          />
          <input
            className={`${filterInputClass} flex-1`}
            placeholder="-"
            inputMode="numeric"
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
          />
        </div>
        <button type="button" onClick={clearFilters} className="block w-full text-right text-xs text-sirpi-muted">
          {t("admin.dashboard.clearFilters")}
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-center text-sm text-sirpi-muted">{t("common.loading")}</p>
      ) : profiles.length === 0 ? (
        <p className="mt-8 text-center text-sm text-sirpi-muted">{t("admin.dashboard.noResults")}</p>
      ) : (
        <div className="pb-8">
          {profiles.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(`/admin/${item.id}`)}
              className="mb-2 block w-full rounded-lg border border-sirpi-border bg-sirpi-surface p-4 text-left"
            >
              <p className="text-[15px] font-bold text-sirpi-text">{item.full_name}</p>
              <p className="mt-1 text-xs text-sirpi-muted">
                {item.gender} • {computeAge(item.date_of_birth)} • {item.religion ?? "-"} • {item.caste ?? "-"} •{" "}
                {item.city ?? "-"}
              </p>
              <p className="mt-1 text-[11px] text-sirpi-primary">
                {item.status} · {item.adminStatus}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
