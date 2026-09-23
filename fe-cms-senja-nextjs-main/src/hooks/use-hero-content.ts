"use client"

import * as React from "react"

import {
  defaultHeroContent,
  HERO_STORAGE_KEY,
  type HeroContent,
} from "@/data/hero"

export function useHeroContent() {
  const [content, setContent] = React.useState<HeroContent>(defaultHeroContent)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedContent = window.localStorage.getItem(HERO_STORAGE_KEY)

      if (storedContent) {
        try {
          setContent(JSON.parse(storedContent) as HeroContent)
        } catch {
          window.localStorage.removeItem(HERO_STORAGE_KEY)
        }
      }

      setIsLoaded(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return { content, isLoaded }
}
