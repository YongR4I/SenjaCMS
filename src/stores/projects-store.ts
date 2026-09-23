"use client";

import { create } from "zustand";
import { API_URL, apiSend, getToken, unwrapItem, unwrapList } from "@/lib/api";
import { projects as fallbackProjects, type Project } from "@/data/projects";

const STORAGE_KEY = "senja-cms-projects";

type ProjectsState = {
  projects: Project[];
  isLoaded: boolean;
  isSaving: boolean;
  error: string;
  load: () => Promise<void>;
  saveProject: (project: Project, originalSlug?: string) => Promise<void>;
  removeProject: (slug: string) => Promise<void>;
};

function toForm(p: Record<string, unknown>): Project {
  const cover = p.cover_image as { src?: string } | undefined;
  const gallery = ((p.gallery as { src?: string; alt?: string; position?: string }[]) ?? []).map((g) => ({
    src: String(g.src ?? ""),
    alt: String(g.alt ?? ""),
    position: g.position,
  }));
  const partners = ((p.partners as { name?: string; slug?: string; image?: unknown }[]) ?? []).map((x) => ({
    name: String(x.name ?? ""),
    slug: String(x.slug ?? ""),
    image: typeof x.image === "string" ? x.image : "",
  }));
  const stats = Array.isArray(p.stats)
    ? (p.stats as { value?: string; label?: string }[]).map((s) => ({
        value: String(s.value ?? ""),
        label: String(s.label ?? ""),
      }))
    : [];
  return {
    slug: String(p.slug ?? ""),
    number: String(p.number ?? ""),
    title: String(p.title ?? ""),
    category: (p.category as Project["category"]) ?? "Workplace",
    location: String(p.location ?? ""),
    year: String(p.year ?? ""),
    client: String(p.client ?? ""),
    image: String(p.image ?? cover?.src ?? ""),
    description: String(p.description ?? p.summary ?? ""),
    overview: String(p.overview ?? ""),
    challenge: String(p.challenge ?? ""),
    solution: String(p.solution ?? ""),
    services: (p.services as string[]) ?? [],
    stats,
    partners,
    gallery,
    featured: Boolean(p.featured),
  };
}

function toPayload(p: Project) {
  return {
    title: p.title,
    slug: p.slug,
    number: p.number,
    category: p.category,
    location: p.location,
    year: p.year,
    client: p.client,
    featured: p.featured,
    summary: p.description,
    description: p.description,
    overview: p.overview,
    challenge: p.challenge,
    solution: p.solution,
    services: p.services,
    content: p.overview,
    stats: p.stats,
    cover_image_path: p.image,
    gallery: p.gallery.map((g) => ({ image_path: g.src, alt: g.alt, position: g.position })),
    partners: p.partners.map((x) => x.slug).filter(Boolean),
  };
}

function readCache(): Project[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return fallbackProjects;
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
  projects: fallbackProjects,
  isLoaded: false,
  isSaving: false,
  error: "",

  load: async () => {
    try {
      const res = await fetch(`${API_URL}/projects?per_page=100`, { cache: "no-store" });
      if (res.ok) {
        const items = unwrapList(await res.json()) as Record<string, unknown>[];
        if (items.length > 0) {
          const list = items.map(toForm);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          set({ projects: list, isLoaded: true });
          return;
        }
      }
    } catch {
      // fallback below
    }
    set({ projects: readCache(), isLoaded: true });
  },

  saveProject: async (project, originalSlug) => {
    set({ isSaving: true, error: "" });
    try {
      if (getToken()) {
        const slug = originalSlug ?? project.slug;
        const exists = get().projects.some((x) => x.slug === slug);
        const json = exists
          ? await apiSend(`/projects/${slug}`, "PUT", toPayload(project))
          : await apiSend("/projects", "POST", toPayload(project));
        const saved = toForm(unwrapItem(json) as Record<string, unknown>);
        const next = exists
          ? get().projects.map((x) => (x.slug === slug ? saved : x))
          : [saved, ...get().projects];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        set({ projects: next });
        return;
      }
      const next = [project, ...get().projects.filter((x) => x.slug !== (originalSlug ?? project.slug))];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      set({ projects: next });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Gagal menyimpan project." });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  removeProject: async (slug) => {
    if (getToken()) {
      await apiSend(`/projects/${slug}`, "DELETE");
    }
    const next = get().projects.filter((x) => x.slug !== slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ projects: next });
  },
}));
