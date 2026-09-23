/**
 * Senja CMS API client — talks to Senja-BE (`/api/v1`) with Passport Bearer token.
 * Token persisted in localStorage `senja-cms-token` (+ refresh token).
 * All list helpers unwrap Laravel paginate `{data}`.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const TOKEN_KEY = "senja-cms-token";
const REFRESH_KEY = "senja-cms-refresh-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string | null, refresh: string | null) {
  if (typeof window === "undefined") return;
  if (access) window.localStorage.setItem(TOKEN_KEY, access);
  else window.localStorage.removeItem(TOKEN_KEY);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  else window.localStorage.removeItem(REFRESH_KEY);
}

export function clearTokens() {
  setTokens(null, null);
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function unwrapList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object" && Array.isArray((json as { data: T[] }).data)) {
    return (json as { data: T[] }).data;
  }
  return [];
}

export function unwrapItem<T>(json: unknown): T | null {
  if (json && typeof json === "object" && "data" in json) return (json as { data: T }).data;
  return (json as T) ?? null;
}

// --- Auth (Passport password grant via BE) ---
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as { message?: string })?.message ?? "Login gagal.");

  const token = (json as { data?: { token?: { access_token?: string; refresh_token?: string } } })?.data?.token;
  setTokens(token?.access_token ?? null, token?.refresh_token ?? null);
  setTokenCookie(token?.access_token ?? null);
  return json;
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Unauthorized");
  return unwrapItem(await res.json());
}

export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, { method: "POST", headers: authHeaders() });
  } catch {
    // ignore — clear locally anyway
  }
  clearTokens();
  setTokenCookie(null);
}

// --- Generic authed JSON ---
export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

export async function apiSend(path: string, method: string, body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (json as { message?: string })?.message ?? `${method} ${path} → ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

// --- Contact inbox (BE-first, CMS local route as fallback handled by caller) ---
export async function fetchInquiriesBE(params = "per_page=50") {
  const json = await apiGet(`/contact-inquiries?${params}`);
  return unwrapList(json);
}

export async function updateInquiryStatusBE(id: number | string, status: "new" | "read") {
  const json = await apiSend(`/contact-inquiries/${id}`, "PATCH", { status });
  return unwrapItem(json);
}

export async function deleteInquiryBE(id: number | string) {
  await apiSend(`/contact-inquiries/${id}`, "DELETE");
}

const TOKEN_COOKIE = "senja_cms_token";

export function setTokenCookie(token: string | null) {
  if (typeof document === "undefined") return;
  document.cookie = token
    ? `${TOKEN_COOKIE}=1; path=/; max-age=86400; samesite=lax`
    : `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

/** Passport refresh-token rotation via BE. */
export async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    const token = json?.data?.token;
    if (token?.access_token) {
      setTokens(token.access_token, token.refresh_token ?? refreshToken);
      setTokenCookie(token.access_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// --- Uploads ---
export async function uploadImageBE(file: File): Promise<{ path: string; url: string }> {
  const token = getToken();
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error((json as { message?: string })?.message ?? "Upload gagal.");
  return (json as { data: { path: string; url: string } }).data;
}
