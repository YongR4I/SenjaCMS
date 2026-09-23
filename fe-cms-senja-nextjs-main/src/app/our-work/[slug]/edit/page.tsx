"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { ProjectForm } from "@/components/project-form"
import { Button } from "@/components/ui/button"
import { useProjectRecord } from "@/hooks/use-project-record"

export default function EditProjectPage() {
  const params = useParams<{ slug: string }>()
  const slug = decodeURIComponent(params.slug)
  const { project, isLoaded } = useProjectRecord(slug)

  if (!isLoaded) {
    return (
      <div className="cms-page animate-pulse">
        <div className="h-32 rounded-3xl bg-muted" />
        <div className="h-96 rounded-3xl bg-muted" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="cms-page items-center justify-center text-center">
        <h1 className="page-title">Project not found.</h1>
        <Button className="mt-4" render={<Link href="/our-work" />}>
          <ArrowLeftIcon /> Back to Our Works
        </Button>
      </div>
    )
  }

  return (
    <div className="cms-page">
      <div className="page-header items-start!">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Back to ${project.title}`}
            render={<Link href={`/our-work/${project.slug}`} />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Our Works · Edit entry</p>
            <h1 className="page-title">Edit {project.title}</h1>
            <p className="page-description">
              Update the project story, media, statistics, and technology partners.
            </p>
          </div>
        </div>
      </div>

      <ProjectForm initialProject={project} mode="edit" />
    </div>
  )
}
