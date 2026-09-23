import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { ProjectForm } from "@/components/project-form"
import { Button } from "@/components/ui/button"

export default function AddProjectPage() {
  return (
    <div className="cms-page">
      <div className="page-header items-start!">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to Our Works"
            render={<Link href="/our-work" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Our Works · New entry</p>
            <h1 className="page-title">Add Project</h1>
            <p className="page-description">
              Add a project using the content structure required by the Senja frontend.
            </p>
          </div>
        </div>
      </div>

      <ProjectForm />
    </div>
  )
}
