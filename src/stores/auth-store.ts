"use client";

import { create } from "zustand";
import {
  fetchMe,
  getToken,
  login as apiLogin,
  logout as apiLogout,
  refreshTokens,
  setTokenCookie,
  clearTokens,
} from "@/lib/api";

export type CmsUser = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

type AuthState = {
  user: CmsUser | null;
  isLoaded: boolean;
  isLoading: boolean;
  error: string;
  /** Passport password-grant login → /auth/me (roles + spatie permissions). */
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Hydrate session: token → me, else refresh-token rotation, else anonymous. */
  load: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
};

function normalizeUser(raw: Record<string, unknown>): CmsUser {
  const names = (v: unknown): string[] =>
    Array.isArray(v)
      ? v.map((r) => (typeof r === "string" ? r : String((r as { name?: unknown })?.name ?? ""))).filter(Boolean)
      : [];
  return {
    id: Number(raw.id ?? 0),
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    roles: names(raw.roles),
    permissions: names(raw.permissions),
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoaded: false,
  isLoading: false,
  error: "",

  login: async (email, password) => {
    set({ isLoading: true, error: "" });
    try {
      await apiLogin(email, password);
      const me = await fetchMe();
      set({ user: normalizeUser(me as Record<string, unknown>), isLoaded: true });
    } catch (err) {
      clearTokens();
      setTokenCookie(null);
      set({ error: err instanceof Error ? err.message : "Login gagal.", user: null, isLoaded: true });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, isLoaded: true });
  },

  load: async () => {
    if (!getToken()) {
      set({ user: null, isLoaded: true });
      return;
    }
    set({ isLoading: true });
    try {
      const me = await fetchMe();
      set({ user: normalizeUser(me as Record<string, unknown>), isLoaded: true });
    } catch {
      // Passport access expired → try refresh-token rotation once.
      const refreshed = await refreshTokens();
      if (refreshed) {
        try {
          const me = await fetchMe();
          set({ user: normalizeUser(me as Record<string, unknown>), isLoaded: true });
          return;
        } catch {
          // fall through
        }
      }
      clearTokens();
      setTokenCookie(null);
      set({ user: null, isLoaded: true });
    } finally {
      set({ isLoading: false });
    }
  },

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    // spatie admin role carries every permission explicitly.
    return user.permissions.includes(permission);
  },

  hasRole: (role) => get().user?.roles.includes(role) ?? false,

  isAdmin: () => get().user?.roles.includes("admin") ?? false,
}));
