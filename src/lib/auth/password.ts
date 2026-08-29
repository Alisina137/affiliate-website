// src/lib/auth/password.ts
import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, with at least one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

export function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  // Use a regular number first, then cast at the end
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Ensure score is within 0-4 range
  const clampedScore = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;

  const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];

  return {
    score: clampedScore,
    label: labels[clampedScore] || "Very Weak",
  };
}
