"use client";

import { create } from "zustand";
import {
  deleteInquiryBE,
  fetchInquiriesBE,
  getToken,
  updateInquiryStatusBE,
  unwrapList,
} from "@/lib/api";
import type { ContactInquiry } from "@/data/contact-inquiries";

type ContactState = {
  inquiries: ContactInquiry[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string;
  /** Laravel-only source of truth (requires contact-inquiries.view). */
  load: () => Promise<void>;
  markRead: (id: string, status: "new" | "read") => Promise<void>;
  remove: (id: string) => Promise<void>;
};

function normalize(it: Record<string, unknown>): ContactInquiry {
  return {
    id: String(it.id),
    name: String(it.name ?? ""),
    email: String(it.email ?? ""),
    company: String(it.company ?? ""),
    phone: String(it.phone ?? ""),
    projectType: String(it.projectType ?? it.project_type ?? ""),
    timeline: String(it.timeline ?? ""),
    message: String(it.message ?? ""),
    status: it.status === "read" ? "read" : "new",
    createdAt: String(it.createdAt ?? it.created_at ?? new Date().toISOString()),
  };
}

export const useContactStore = create<ContactState>()((set, get) => ({
  inquiries: [],
  isLoaded: false,
  isLoading: false,
  error: "",

  load: async () => {
    if (!getToken()) {
      set({ inquiries: [], isLoaded: true, error: "Sign in to load inquiries from Laravel." });
      return;
    }
    set({ isLoading: true, error: "" });
    try {
      const items = unwrapList(await fetchInquiriesBE()) as Record<string, unknown>[];
      set({ inquiries: items.map(normalize), isLoaded: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Gagal memuat inquiries.",
        isLoaded: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  markRead: async (id, status) => {
    await updateInquiryStatusBE(id, status);
    set({
      inquiries: get().inquiries.map((q) => (q.id === id ? { ...q, status } : q)),
    });
  },

  remove: async (id) => {
    await deleteInquiryBE(id);
    set({ inquiries: get().inquiries.filter((q) => q.id !== id) });
  },
}));
