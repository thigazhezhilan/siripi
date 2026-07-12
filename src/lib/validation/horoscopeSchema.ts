import { z } from 'zod';

const optionalText = z.string().trim().optional().or(z.literal(''));

export const horoscopeSchema = z.object({
  star: optionalText,
  raasi: optionalText,
  lagnam: optionalText,
  chevvaiDosham: z.boolean(),
  birthPlace: optionalText,
  horoscopeImageUrl: optionalText,
});

export type HoroscopeFormValues = z.infer<typeof horoscopeSchema>;
