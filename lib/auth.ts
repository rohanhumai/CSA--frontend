const TOKEN_KEY = "course_user_token";
const EMAIL_KEY = "course_user_email";
const ADMIN_TOKEN_KEY = "course_admin_token";
const ADMIN_EMAIL_KEY = "course_admin_email";

export function getStoredToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function getStoredEmail(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(EMAIL_KEY) ?? "";
}

export function storeAuth(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getStoredAdminToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}

export function getStoredAdminEmail(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(ADMIN_EMAIL_KEY) ?? "";
}

export function storeAdminAuth(token: string, email: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_EMAIL_KEY, email);
}

export function clearAdminAuth(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}
