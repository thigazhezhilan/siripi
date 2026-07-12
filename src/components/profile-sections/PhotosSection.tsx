"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  photoPublicUrl,
  useAddPhoto,
  useOwnPhotos,
  useRemovePhoto,
  useSetPrimaryPhoto,
} from "@/hooks/usePhotos";

export function PhotosSection() {
  const { t } = useTranslation();
  const { data: photos = [], isLoading } = useOwnPhotos();
  const addPhoto = useAddPhoto();
  const setPrimary = useSetPrimaryPhoto();
  const removePhoto = useRemovePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await addPhoto.mutateAsync({ file, isPrimary: photos.length === 0 });
  };

  return (
    <div>
      <p className="mb-4 text-sm text-sirpi-muted">{t("onboarding.photos.subtitle")}</p>

      <div className="mb-4 flex flex-wrap gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="w-[120px] text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPublicUrl(photo.storage_path)}
              alt=""
              className="h-[120px] w-[120px] rounded-lg bg-sirpi-surface object-cover"
            />
            {photo.is_primary ? (
              <span className="mt-1 inline-block rounded-full bg-sirpi-primary px-2 py-0.5 text-[11px] font-bold text-white">
                {t("onboarding.photos.primaryPhoto")}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setPrimary.mutate(photo.id)}
                className="mt-1 block text-xs text-sirpi-primary"
              >
                {t("onboarding.photos.setPrimary")}
              </button>
            )}
            <button
              type="button"
              onClick={() => removePhoto.mutate(photo)}
              className="mt-1 block text-xs text-sirpi-muted"
            >
              {t("onboarding.photos.remove")}
            </button>
          </div>
        ))}
      </div>

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
        disabled={addPhoto.isPending}
        className="w-full rounded-lg border border-sirpi-primary py-3 text-sm font-bold text-sirpi-primary disabled:opacity-60"
      >
        {addPhoto.isPending ? t("onboarding.photos.uploading") : t("onboarding.photos.addPhoto")}
      </button>

      {addPhoto.isError ? (
        <p className="mt-2 text-sm text-sirpi-primary">{t("onboarding.photos.uploadError")}</p>
      ) : null}
      {isLoading ? <p className="mt-2 text-sm text-sirpi-muted">{t("common.loading")}</p> : null}
    </div>
  );
}
