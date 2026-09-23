"use client";

import { create } from "zustand";
import { API_URL, apiSend, getToken, unwrapItem, unwrapList } from "@/lib/api";
import { technologyPartners as fallbackPartners, type TechnologyPartner } from "@/data/partners";

const STORAGE_KEY = "senja-cms-partners";

type PartnersState = {
  partners: TechnologyPartner[];
  isLoaded: boolean;
  isSaving: boolean;
  error: string;
  load: () => Promise<void>;
  savePartner: (partner: TechnologyPartner, originalSlug?: string) => Promise<void>;
  removePartner: (slug: string) => Promise<void>;
};

function img(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") return String((v as { src?: string }).src ?? "");
  return "";
}

function toForm(p: Record<string, unknown>): TechnologyPartner {
  return {
    slug: String(p.slug ?? ""),
    number: String(p.number ?? ""),
    name: String(p.name ?? ""),
    image: img(p.image ?? p.logo),
    description: String(p.description ?? ""),
    capabilities: (p.capabilities as string[]) ?? [],
    relationship: String(p.relationship ?? ""),
    relationshipDetail: String(p.relationshipDetail ?? p.relationship_detail ?? ""),
    heroImage: img(p.heroImage ?? p.hero_image),
    gallery: ((p.gallery as { src?: string; alt?: string; position?: string }[]) ?? []).map((g) => ({
      src: String(g.src ?? ""),
      alt: String(g.alt ?? ""),
      position: g.position,
    })),
    products: ((p.products as { name?: string; category?: string; description?: string; image?: unknown }[]) ?? []).map(
      (x) => ({
        name: String(x.name ?? ""),
        category: String(x.category ?? ""),
        description: String(x.description ?? ""),
        image: img(x.image),
      }),
    ),
  };
}

function toPayload(p: TechnologyPartner) {
  return {
    name: p.name,
    slug: p.slug,
    number: p.number,
    category: (p as { category?: string }).category,
    description: p.description,
    capabilities: p.capabilities,
    relationship: p.relationship,
    relationship_detail: p.relationshipDetail,
    logo_path: p.image,
    hero_image_path: p.heroImage,
    gallery: p.gallery.map((g) => ({ image_path: g.src, alt: g.alt, position: g.position })),
    products: p.products.map((x) => ({
      name: x.name,
      category: x.category,
      description: x.description,
      image_path: x.image,
    })),
  };
}

function readCache(): TechnologyPartner[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TechnologyPartner[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return fallbackPartners;
}

export const usePartnersStore = create<PartnersState>()((set, get) => ({
  partners: fallbackPartners,
  isLoaded: false,
  isSaving: false,
  error: "",

  load: async () => {
    try {
      // Authed CMS sees drafts too (?active=all); public sees actives only.
      const qs = getToken() ? "?per_page=100&active=all" : "?per_page=100";
      const res = await fetch(`${API_URL}/partners${qs}`, { cache: "no-store" });
      if (res.ok) {
        const items = unwrapList(await res.json()) as Record<string, unknown>[];
        if (items.length > 0) {
          const list = items.map(toForm);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          set({ partners: list, isLoaded: true });
          return;
        }
      }
    } catch {
      // fallback below
    }
    set({ partners: readCache(), isLoaded: true });
  },

  savePartner: async (partner, originalSlug) => {
    set({ isSaving: true, error: "" });
    try {
      if (getToken()) {
        const slug = originalSlug ?? partner.slug;
        const exists = get().partners.some((x) => x.slug === slug);
        const json = exists
          ? await apiSend(`/partners/${slug}`, "PUT", toPayload(partner))
          : await apiSend("/partners", "POST", toPayload(partner));
        const saved = toForm(unwrapItem(json) as Record<string, unknown>);
        const next = exists
          ? get().partners.map((x) => (x.slug === slug ? saved : x))
          : [saved, ...get().partners];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        set({ partners: next });
        return;
      }
      const next = [partner, ...get().partners.filter((x) => x.slug !== (originalSlug ?? partner.slug))];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      set({ partners: next });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Gagal menyimpan partner." });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  removePartner: async (slug) => {
    if (getToken()) {
      await apiSend(`/partners/${slug}`, "DELETE");
    }
    const next = get().partners.filter((x) => x.slug !== slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ partners: next });
  },
}));
