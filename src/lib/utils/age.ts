export function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const diffMs = Date.now() - dob.getTime();
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
}
