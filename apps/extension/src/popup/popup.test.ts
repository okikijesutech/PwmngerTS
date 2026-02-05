import { passwordStrength } from "../password/strength";

describe("passwordStrength", () => {
  test("returns 0 for empty password", () => {
    expect(passwordStrength("")).toBe(0);
  });

  test("scores correctly for length only", () => {
    expect(passwordStrength("longpassword")).toBe(2); // Length + lowercase
  });

  test("scores for mixed characters", () => {
    expect(passwordStrength("abc1")).toBe(2); // lower + number
  });

  test("scores max for strong password", () => {
    // Length (12+) + lower + upper + number + special
    const strong = "StrongP@ssw0rd!";
    expect(passwordStrength(strong)).toBe(5);
  });
});
