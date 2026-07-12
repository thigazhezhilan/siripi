import { z } from 'zod';

const optionalDigits = z
  .string()
  .trim()
  .regex(/^\d*$/, 'onboarding.personal.validation.numberInvalid')
  .optional()
  .or(z.literal(''));

// Comma-separated free text in the form (e.g. "Hindu, Christian"), split into a
// text[] array at submit time — simplest UI for a demo, no chip/multi-select needed.
const optionalCsv = z.string().trim().optional().or(z.literal(''));

export const preferencesSchema = z.object({
  ageMin: optionalDigits,
  ageMax: optionalDigits,
  heightMinCm: optionalDigits,
  heightMaxCm: optionalDigits,
  preferredReligion: optionalCsv,
  preferredCaste: optionalCsv,
  preferredEducation: optionalCsv,
  preferredLocation: optionalCsv,
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function csvToArray(value: string | undefined): string[] | null {
  if (!value || value.trim().length === 0) return null;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return items.length > 0 ? items : null;
}
