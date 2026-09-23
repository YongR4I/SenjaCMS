"use client";

import { create } from "zustand";
import { API_URL, apiSend, getToken, unwrapItem } from "@/lib/api";
import { ABOUT_STORAGE_KEY, defaultAboutContent, type AboutContent } from "@/data/about";

type AboutState = {
  content: AboutContent;
  isLoaded: boolean;
  isSaving: boolean;
  error: string;
  load: () => Promise<void>;
  /** BE-first (PUT /about when authed), localStorage offline cache. */
  save: (content: AboutContent) => Promise<void>;
};

async function fetchAboutBE(): Promise<AboutContent | null> {
  try {
    const res = await fetch(`${API_URL}/about`, { cache: "no-store" });
    if (!res.ok) return null;
    const item = unwrapItem(await res.json());
    if (!item || typeof item !== "object") return null;
    return { ...defaultAboutContent, ...(item as Partial<AboutContent>) };
  } catch {
    return null;
  }
}

function readCache(): AboutContent {
  try {
    const raw = window.localStorage.getItem(ABOUT_STORAGE_KEY);
    if (raw) return { ...defaultAboutContent, ...JSON.parse(raw) };
  } catch {
    window.localStorage.removeItem(ABOUT_STORAGE_KEY);
  }
  return defaultAboutContent;
}

export const useAboutStore = create<AboutState>()((set) => ({
  content: defaultAboutContent,
  isLoaded: false,
  isSaving: false,
  error: "",

  load: async () => {
    const be = await fetchAboutBE();
    if (be) {
      window.localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(be));
      set({ content: be, isLoaded: true });
      return;
    }
    set({ content: readCache(), isLoaded: true });
  },

  save: async (content) => {
    set({ isSaving: true, error: "" });
    window.localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(content));
    if (getToken()) {
      try {
        await apiSend("/about", "PUT", content);
      } catch (err) {
        set({ error: err instanceof Error ? err.message : "Gagal menyimpan ke BE." });
        throw err;
      } finally {
        set({ isSaving: false });
      }
    }
    set({ content, isSaving: false });
  },
}));
