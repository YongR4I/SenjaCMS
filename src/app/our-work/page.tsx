"use client"

import * as React from "react"
import Link from "next/link"
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { projects, type Project } from "@/data/projects"
import { Input } from "@/components/ui/input"

const PROJECTS_STORAGE_KEY = "senja-cms-projects"

const categoryColors: Record<Project["category"], string> = {
  Workplace: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "F&B": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Education: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Hospitality: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

export default function OurWorkPage() {
  const [list, setList] = React.useState<Project[]>(projects)
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)
      if (!savedProjects) return

      try {
        setList(JSON.parse(savedProjects) as Project[])
      } catch {
        window.localStorage.removeItem(PROJECTS_STORAGE_KEY)
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const removeProject = (slug: string) => {
    const nextProjects = list.filter((project) => project.slug !== slug)
    setList(nextProjects)
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(nextProjects))
  }

  const filteredList = React.useMemo(() => list.filter((project) =>
    [project.title, project.description, project.category, project.location, project.client, project.year]
      .join(" ").toLowerCase().includes(query.trim().toLowerCase()),
  ), [list, query])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredList.length / pageSize))
  const visibleList = filteredList.slice((page - 1) * pageSize, page * pageSize)
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPage(1))
    return () => window.cancelAnimationFrame(frame)
  }, [query])

  return (
    <div className="cms-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Portfolio · {list.length.toString().padStart(2, "0")} projects</p>
          <h1 className="page-title">Our Works</h1>
          <p className="page-description">
            Manage the projects displayed on the Senja website.
          </p>
        </div>
        <Button size="lg" render={<Link href="/our-work/add" />}>
          <PlusIcon className="size-4" />
          Add Project
        </Button>
      </div>

      <div className="relative max-w-lg"><SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search project, category, location, or client..." className="pl-11" /></div>

      <Card className="overflow-hidden">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-14 w-16 px-5 text-xs uppercase tracking-wider text-muted-foreground">No.</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleList.map((project) => (
                <TableRow key={project.slug}>
                  <TableCell className="px-5 py-4 font-mono text-xs">{project.number}</TableCell>
                  <TableCell>
                    <div className="min-w-52">
                      <p className="font-medium">{project.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[project.category]}>
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>
                    <Badge variant={project.featured ? "default" : "outline"}>
                      {project.featured ? "Featured" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`View ${project.title}`}
                        render={<Link href={`/our-work/${project.slug}`} />}
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Edit ${project.title}`}
                        render={<Link href={`/our-work/${project.slug}/edit`} />}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Delete ${project.title}`}
                        onClick={() => removeProject(project.slug)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No projects available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {pageCount > 1 && <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredList.length)} of {filteredList.length}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><span className="flex items-center px-2 text-sm font-medium">Page {page} of {pageCount}</span><Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}
    </div>
  )
}
