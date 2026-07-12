"use client";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
};

export function FormSwitchField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
}: Props<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const checked = Boolean(value);
        return (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-sirpi-text">{label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => onChange(!checked)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-150 ${
                checked ? "bg-sirpi-primary" : "bg-sirpi-border"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150 ${
                  checked ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        );
      }}
    />
  );
}
