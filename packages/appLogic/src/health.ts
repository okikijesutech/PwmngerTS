import type { Vault, VaultEntry } from "@pwmnger/vault";

export interface HealthReport {
  totalEntries: number;
  weakCount: number;
  reusedCount: number;
  score: number; // 0-100
  vulnerableEntries: { id: string; issues: string[] }[];
}

// Simple strength check (can be improved with zxcvbn)
function checkStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  const rules = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
  if (rules < 3) return "weak";
  if (password.length < 12) return "medium";
  return "strong";
}

export function analyzeVaultHealth(vault: Vault): HealthReport {
  const entries = vault.entries;
  const passwordMap = new Map<string, string[]>(); // password -> entryIds[]
  let weakCount = 0;
  const vulnerableEntries: { id: string; issues: string[] }[] = [];

  // Pass 1: Strength & Grouping
  entries.forEach(entry => {
    const issues: string[] = [];
    
    // Check Strength
    const strength = checkStrength(entry.password);
    if (strength === "weak") {
      weakCount++;
      issues.push("Weak password");
    }

    // specific check for very short
    if (entry.password.length < 6) {
        issues.push("Very short password");
    }

    // Group for reuse
    const existing = passwordMap.get(entry.password) || [];
    existing.push(entry.id);
    passwordMap.set(entry.password, existing);

    if (issues.length > 0) {
      vulnerableEntries.push({ id: entry.id, issues });
    }
  });

  // Pass 2: Reuse
  let reusedCount = 0;
  passwordMap.forEach((ids, password) => {
    if (ids.length > 1) {
      reusedCount += ids.length;
      ids.forEach(id => {
        // Find if already in vulnerable
        const existingVuln = vulnerableEntries.find(v => v.id === id);
        if (existingVuln) {
          existingVuln.issues.push("Reused password");
        } else {
          vulnerableEntries.push({ id, issues: ["Reused password"] });
        }
      });
    }
  });

  // Calculate Score
  // 100 - (weak * 10) - (reused * 5)
  // Clamp to 0
  let score = 100 - (weakCount * 10) - (reusedCount * 5);
  if (score < 0) score = 0;

  return {
    totalEntries: entries.length,
    weakCount,
    reusedCount,
    score,
    vulnerableEntries
  };
}
