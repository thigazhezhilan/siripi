export const ONBOARDING_STEPS = [
  { key: "personal", route: "/onboarding/personal", titleKey: "onboarding.steps.personal" },
  { key: "photos", route: "/onboarding/photos", titleKey: "onboarding.steps.photos" },
  { key: "horoscope", route: "/onboarding/horoscope", titleKey: "onboarding.steps.horoscope" },
  { key: "family", route: "/onboarding/family", titleKey: "onboarding.steps.family" },
  { key: "preferences", route: "/onboarding/preferences", titleKey: "onboarding.steps.preferences" },
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]["key"];

// Photo upload is skipped entirely for female profiles (product decision — not
// hidden/disabled, just never shown). gender = 'other' is treated like male.
export function getOnboardingSteps(gender: string | undefined) {
  if (gender === "female") {
    return ONBOARDING_STEPS.filter((step) => step.key !== "photos");
  }
  return ONBOARDING_STEPS;
}
