"use client"

import * as React from "react"

import { usePartnersStore } from "@/stores/partners-store";

export function usePartnerRecord(slug: string) {
  const partners = usePartnersStore((s) => s.partners)
  const isLoaded = usePartnersStore((s) => s.isLoaded)
  const load = usePartnersStore((s) => s.load)

  React.useEffect(() => {
    if (!isLoaded) void load()
  }, [isLoaded, load])

  const partner = React.useMemo(
    () => partners.find((item) => item.slug === slug),
    [partners, slug],
  )

  return { partner, isLoaded }
}
