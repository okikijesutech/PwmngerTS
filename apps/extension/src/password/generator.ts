const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  let charset = "";

  if (options.lowercase) charset += LOWER;
  if (options.uppercase) charset += UPPER;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  if (!charset) {
    throw new Error("No character sets selected");
  }

  const passwordChars: string[] = [];
  const randomValues = crypto.getRandomValues(new Uint32Array(options.length));

  for (let i = 0; i < options.length; i++) {
    passwordChars.push(charset[randomValues[i]! % charset.length]!);
  }

  return passwordChars.join("");
}
