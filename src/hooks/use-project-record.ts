"use client"

import * as React from "react"

import { useProjectsStore } from "@/stores/projects-store";

export function useProjectRecord(slug: string) {
  const projects = useProjectsStore((s) => s.projects)
  const isLoaded = useProjectsStore((s) => s.isLoaded)
  const load = useProjectsStore((s) => s.load)

  React.useEffect(() => {
    if (!isLoaded) void load()
  }, [isLoaded, load])

  const project = React.useMemo(
    () => projects.find((item) => item.slug === slug),
    [projects, slug],
  )

  return { project, isLoaded }
}
