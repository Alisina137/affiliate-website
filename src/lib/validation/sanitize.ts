// src/lib/validation/sanitize.ts
// Sanitize string inputs
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent XSS
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Sanitize HTML content (allow safe HTML)
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  // Remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "");
}

// Sanitize slug
export function sanitizeSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate phone number (US format)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize object recursively (simplified version)
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: { html?: boolean; slug?: boolean } = {}
): T {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === "string") {
      if (options.html) {
        result[key] = sanitizeHtml(value);
      } else if (options.slug) {
        result[key] = sanitizeSlug(value);
      } else {
        result[key] = sanitizeString(value);
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
