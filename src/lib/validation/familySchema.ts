import { z } from 'zod';

export const FAMILY_TYPE_OPTIONS = ['nuclear', 'joint'] as const;
export const FAMILY_VALUES_OPTIONS = ['traditional', 'moderate', 'liberal'] as const;

const optionalText = z.string().trim().optional().or(z.literal(''));
const optionalDigits = z
  .string()
  .trim()
  .regex(/^\d*$/, 'onboarding.personal.validation.numberInvalid')
  .optional()
  .or(z.literal(''));

export const familySchema = z.object({
  fatherName: optionalText,
  fatherOccupation: optionalText,
  motherName: optionalText,
  motherOccupation: optionalText,
  siblingsCount: optionalDigits,
  familyType: z.enum(FAMILY_TYPE_OPTIONS).optional(),
  familyValues: z.enum(FAMILY_VALUES_OPTIONS).optional(),
});

export type FamilyFormValues = z.infer<typeof familySchema>;
