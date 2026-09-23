"use client"

import * as React from "react"

import { getProjectBySlug, projects, type Project } from "@/data/projects"

const PROJECTS_STORAGE_KEY = "senja-cms-projects"

export function useProjectRecord(slug: string) {
  const [project, setProject] = React.useState<Project | undefined>(() =>
    getProjectBySlug(slug)
  )
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      let projectList = projects
      const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)

      if (storedProjects) {
        try {
          projectList = JSON.parse(storedProjects) as Project[]
        } catch {
          window.localStorage.removeItem(PROJECTS_STORAGE_KEY)
        }
      }

      setProject(projectList.find((item) => item.slug === slug))
      setIsLoaded(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [slug])

  return { project, isLoaded }
}
