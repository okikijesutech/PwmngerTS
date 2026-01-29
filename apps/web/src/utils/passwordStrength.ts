export type Strength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): Strength {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "weak";
  if (score === 2 || score === 3) return "medium";
  return "strong";
}
