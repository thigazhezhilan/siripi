"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CommonProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  optionalLabel?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
};

type Props<TFieldValues extends FieldValues> = CommonProps<TFieldValues> &
  Omit<
    InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange" | "onBlur" | "name"
  >;

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  optionalLabel,
  multiline,
  numberOfLines,
  className,
  ...inputProps
}: Props<TFieldValues>) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-sirpi-text">
            {label}
            {optionalLabel ? ` ${t("common.optional")}` : ""}
          </label>
          <div
            className={`rounded-lg border bg-sirpi-surface transition-colors duration-150 ${
              error || focused ? "border-sirpi-primary" : "border-sirpi-border"
            }`}
          >
            {multiline ? (
              <textarea
                {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                rows={numberOfLines ?? 3}
                className={`w-full resize-none rounded-lg bg-transparent px-4 py-2 text-base text-sirpi-text outline-none placeholder:text-sirpi-muted ${
                  className ?? ""
                }`}
                value={typeof value === "string" ? value : (value ?? "")}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
              />
            ) : (
              <input
                {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
                className={`w-full rounded-lg bg-transparent px-4 py-2 text-base text-sirpi-text outline-none placeholder:text-sirpi-muted ${
                  className ?? ""
                }`}
                value={typeof value === "string" ? value : (value ?? "")}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
              />
            )}
          </div>
          {error?.message ? (
            <p className="mt-1 text-xs text-sirpi-primary">{t(error.message)}</p>
          ) : null}
        </div>
      )}
    />
  );
}
