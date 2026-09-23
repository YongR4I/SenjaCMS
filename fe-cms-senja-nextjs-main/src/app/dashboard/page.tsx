import Link from "next/link"
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  EyeIcon,
  ImageIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { projects } from "@/data/projects"

const overview = [
  { label: "Published projects", value: projects.length.toString().padStart(2, "0"), icon: BriefcaseIcon, color: "bg-senja-cyan" },
  { label: "Featured works", value: projects.filter((project) => project.featured).length.toString().padStart(2, "0"), icon: SparklesIcon, color: "bg-senja-orange text-white" },
  { label: "Media assets", value: projects.reduce((total, project) => total + project.gallery.length + 1, 0).toString(), icon: ImageIcon, color: "bg-senja-black text-white" },
]

export default function DashboardPage() {
  return (
    <div className="cms-page">
      <section className="relative overflow-hidden rounded-[2rem] bg-senja-black p-7 text-white sm:p-10 lg:p-12">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-senja-cyan/20 blur-3xl" />
        <div className="absolute bottom-0 right-16 h-1/2 w-28 skew-x-[-18deg] bg-senja-orange/90" />
        <div className="relative max-w-2xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-senja-cyan">
            Senja Content Studio
          </p>
          <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            Everything your<br />website needs.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            Manage stories, projects, partners, and every customer touchpoint from one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" render={<Link href="/our-work/add" />}>
              Add new project <ArrowUpRightIcon />
            </Button>
            <Button className="border-white/20 bg-white/10 shadow-none hover:bg-white/20" render={<Link href="/hero" />}>
              Edit homepage
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overview.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-3 text-4xl font-black tracking-[-0.05em]">{item.value}</p>
              </div>
              <div className={`flex size-14 items-center justify-center rounded-2xl ${item.color}`}>
                <item.icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardContent>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="page-eyebrow">Portfolio</p>
                <h2 className="text-xl font-bold tracking-tight">Recent projects</h2>
              </div>
              <Button variant="outline" size="sm" render={<Link href="/our-work" />}>
                View all <ArrowUpRightIcon />
              </Button>
            </div>
            <div className="space-y-2">
              {projects.slice(0, 4).map((project) => (
                <div key={project.slug} className="flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-senja-black font-mono text-xs text-senja-cyan">
                    {project.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.location} · {project.year}</p>
                  </div>
                  {project.featured && <Badge>Featured</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-senja-cyan">
          <CardContent className="flex h-full flex-col justify-between gap-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-senja-black text-white">
              <EyeIcon className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/50">Live preview</p>
              <h2 className="mt-2 text-3xl font-black leading-none tracking-[-0.045em]">See the experience your visitors see.</h2>
              <Button className="mt-6" render={<a href="http://localhost:3001" target="_blank" rel="noreferrer" />}>
                Open website <ArrowUpRightIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
