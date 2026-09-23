"use client"

import * as React from "react"

import { useHeroStore } from "@/stores/hero-store";

export function useHeroContent() {
  const content = useHeroStore((s) => s.content)
  const isLoaded = useHeroStore((s) => s.isLoaded)
  const load = useHeroStore((s) => s.load)

  React.useEffect(() => {
    if (!isLoaded) void load()
  }, [isLoaded, load])

  return { content, isLoaded }
}
