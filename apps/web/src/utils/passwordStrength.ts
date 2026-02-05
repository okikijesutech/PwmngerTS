export function getPasswordStrength(password: string): string {
  if (!password) return "None";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score < 2) return "Weak";
  if (score < 3) return "Fair";
  if (score < 5) return "Good";
  if (score < 6) return "Strong";
  return "Very Strong";
}
