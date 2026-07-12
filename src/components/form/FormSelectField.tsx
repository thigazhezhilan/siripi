"use client";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Option = { value: string; label: string };

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: Option[];
  optionalLabel?: boolean;
};

export function FormSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  optionalLabel,
}: Props<TFieldValues>) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-sirpi-text">
            {label}
            {optionalLabel ? ` ${t("common.optional")}` : ""}
          </label>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const selected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-150 active:scale-95 ${
                    selected
                      ? "border-sirpi-primary bg-sirpi-primary font-semibold text-white"
                      : "border-sirpi-border bg-sirpi-surface text-sirpi-text"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {error?.message ? (
            <p className="mt-1 text-xs text-sirpi-primary">{t(error.message)}</p>
          ) : null}
        </div>
      )}
    />
  );
}
