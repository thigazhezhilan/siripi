import { z } from 'zod';

export const GENDER_OPTIONS = ['male', 'female'] as const;
export const RELATION_OPTIONS = ['self', 'parent', 'sibling', 'relative'] as const;
export const MARITAL_STATUS_OPTIONS = ['never_married', 'divorced', 'widowed'] as const;

const optionalText = z.string().trim().optional().or(z.literal(''));
const optionalDigits = z
  .string()
  .trim()
  .regex(/^\d*$/, 'onboarding.personal.validation.numberInvalid')
  .optional()
  .or(z.literal(''));

export const personalDetailsSchema = z.object({
  fullName: z.string().trim().min(1, 'onboarding.personal.validation.fullNameRequired'),
  gender: z.enum(GENDER_OPTIONS, 'onboarding.personal.validation.genderRequired'),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'onboarding.personal.validation.dateOfBirthRequired')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'onboarding.personal.validation.dateOfBirthInvalid')
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      'onboarding.personal.validation.dateOfBirthInvalid'
    )
    .refine((value) => {
      const ageMs = Date.now() - new Date(value).getTime();
      return ageMs / (365.25 * 24 * 60 * 60 * 1000) >= 18;
    }, 'onboarding.personal.validation.dateOfBirthTooYoung'),
  timeOfBirth: optionalText,
  profileOwnerRelation: z.enum(RELATION_OPTIONS),
  maritalStatus: z.enum(MARITAL_STATUS_OPTIONS),
  heightCm: optionalDigits,
  motherTongue: optionalText,
  religion: optionalText,
  caste: optionalText,
  subCaste: optionalText,
  education: optionalText,
  occupation: optionalText,
  annualIncomeRange: optionalText,
  city: z.string().trim().min(1, 'onboarding.personal.validation.cityRequired'),
  district: optionalText,
  state: optionalText,
  country: optionalText,
  aboutMeEn: optionalText,
  aboutMeTa: optionalText,
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
