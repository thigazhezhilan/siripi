"use client";

import { useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormSwitchField } from "@/components/form/FormSwitchField";
import { FormTextField } from "@/components/form/FormTextField";
import { useAuth } from "@/lib/auth/AuthContext";
import { uploadImageToProfilePhotos } from "@/lib/storage/uploadImage";
import { supabase } from "@/lib/supabase";
import { HoroscopeFormValues } from "@/lib/validation/horoscopeSchema";

export function HoroscopeForm({ control }: { control: Control<HoroscopeFormValues> }) {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageField = useController({ control, name: "horoscopeImageUrl" });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;

    setUploading(true);
    try {
      const path = await uploadImageToProfilePhotos(userId, file, "horoscope-");
      const { data } = supabase.storage.from("profile-photos").getPublicUrl(path);
      imageField.field.onChange(data.publicUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <FormTextField control={control} name="star" label={t("onboarding.horoscope.star")} optionalLabel />
      <FormTextField control={control} name="raasi" label={t("onboarding.horoscope.raasi")} optionalLabel />
      <FormTextField control={control} name="lagnam" label={t("onboarding.horoscope.lagnam")} optionalLabel />
      <FormSwitchField control={control} name="chevvaiDosham" label={t("onboarding.horoscope.chevvaiDosham")} />
      <FormTextField
        control={control}
        name="birthPlace"
        label={t("onboarding.horoscope.birthPlace")}
        optionalLabel
      />

      <div className="mb-4">
        <p className="mb-1 text-sm text-sirpi-text">{t("onboarding.horoscope.horoscopeImage")}</p>
        {imageField.field.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageField.field.value}
            alt=""
            className="mb-2 h-40 w-40 rounded-lg bg-sirpi-surface object-cover"
          />
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-lg border border-sirpi-primary py-2 text-sm font-bold text-sirpi-primary disabled:opacity-60"
        >
          {uploading ? t("common.loading") : t("onboarding.horoscope.uploadChart")}
        </button>
      </div>
    </>
  );
}
