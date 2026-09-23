"use client"

import * as React from "react"

import {
  getPartnerBySlug,
  technologyPartners,
  type TechnologyPartner,
} from "@/data/partners"

const PARTNERS_STORAGE_KEY = "senja-cms-partners"

export function usePartnerRecord(slug: string) {
  const [partner, setPartner] = React.useState<TechnologyPartner | undefined>(
    () => getPartnerBySlug(slug)
  )
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let partners = technologyPartners
      const storedPartners = window.localStorage.getItem(PARTNERS_STORAGE_KEY)

      if (storedPartners) {
        try {
          partners = JSON.parse(storedPartners) as TechnologyPartner[]
        } catch {
          window.localStorage.removeItem(PARTNERS_STORAGE_KEY)
        }
      }

      setPartner(partners.find((item) => item.slug === slug))
      setIsLoaded(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [slug])

  return { partner, isLoaded }
}
