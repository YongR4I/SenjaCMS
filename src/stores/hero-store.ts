"use client";

import { create } from "zustand";
import { API_URL, apiSend, getToken, unwrapItem } from "@/lib/api";
import { defaultHeroContent, HERO_STORAGE_KEY, type HeroContent } from "@/data/hero";

type HeroState = {
  content: HeroContent;
  isLoaded: boolean;
  isSaving: boolean;
  error: string;
  load: () => Promise<void>;
  /** BE-first (PUT /hero when authed), localStorage offline cache. */
  save: (content: HeroContent) => Promise<void>;
};

async function fetchHeroBE(): Promise<HeroContent | null> {
  try {
    const res = await fetch(`${API_URL}/hero`, { cache: "no-store" });
    if (!res.ok) return null;
    const item = unwrapItem(await res.json()) as {
      eyebrow?: string; title?: string; subtitle?: string;
      button_label?: string; buttonLabel?: string;
      button_link?: string; buttonLink?: string;
      images?: ({ src?: string } | string)[];
    } | null;
    if (!item) return null;
    return {
      eyebrow: item.eyebrow ?? defaultHeroContent.eyebrow,
      title: item.title ?? defaultHeroContent.title,
      subtitle: item.subtitle ?? defaultHeroContent.subtitle,
      buttonLabel: item.buttonLabel ?? item.button_label ?? defaultHeroContent.buttonLabel,
      buttonLink: item.buttonLink ?? item.button_link ?? defaultHeroContent.buttonLink,
      images: (item.images ?? []).map((img) => (typeof img === "string" ? img : (img.src ?? ""))).filter(Boolean),
    };
  } catch {
    return null;
  }
}

function readCache(): HeroContent {
  try {
    const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as HeroContent;
  } catch {
    window.localStorage.removeItem(HERO_STORAGE_KEY);
  }
  return defaultHeroContent;
}

export const useHeroStore = create<HeroState>()((set) => ({
  content: defaultHeroContent,
  isLoaded: false,
  isSaving: false,
  error: "",

  load: async () => {
    const be = await fetchHeroBE();
    if (be) {
      window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(be));
      set({ content: be, isLoaded: true });
      return;
    }
    set({ content: readCache(), isLoaded: true });
  },

  save: async (content) => {
    set({ isSaving: true, error: "" });
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(content));
    if (getToken()) {
      try {
        await apiSend("/hero", "PUT", {
          eyebrow: content.eyebrow,
          title: content.title,
          subtitle: content.subtitle,
          button_label: content.buttonLabel,
          button_link: content.buttonLink,
          images: content.images.map((src) => ({ image_path: src })),
        });
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
