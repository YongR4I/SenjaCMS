"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  ImageOffIcon,
  PencilIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useProjectRecord } from "@/hooks/use-project-record"

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = decodeURIComponent(params.slug)
  const { project, isLoaded } = useProjectRecord(slug)

  if (!isLoaded) {
    return <ProjectPageSkeleton />
  }

  if (!project) {
    return (
      <div className="cms-page items-center justify-center text-center">
        <div className="max-w-md rounded-3xl bg-white p-10 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <p className="page-eyebrow">Project not found</p>
          <h1 className="page-title">This project is unavailable.</h1>
          <Button className="mt-6" render={<Link href="/our-work" />}>
            <ArrowLeftIcon /> Back to Our Works
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="cms-page">
      <div className="page-header">
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
            <p className="page-eyebrow">
              Project {project.number} · {project.category}
            </p>
            <h1 className="page-title">{project.title}</h1>
            <p className="page-description">{project.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            render={
              <a
                href={`http://localhost:3001/our-work/${project.slug}`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ExternalLinkIcon /> Open website
          </Button>
          <Button render={<Link href={`/our-work/${project.slug}/edit`} />}>
            <PencilIcon /> Edit Project
          </Button>
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardContent>
            <ProjectImage
              src={project.image}
              alt={project.title}
              className="h-[26rem] object-cover"
            />
            <p className="mt-3 break-all text-xs text-muted-foreground">{project.image}</p>
          </CardContent>
        </Card>
        <Card className="bg-senja-black text-white">
          <CardContent className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <Badge className="bg-senja-cyan text-senja-black">{project.category}</Badge>
              {project.featured && (
                <Badge className="bg-senja-orange text-white">Featured</Badge>
              )}
            </div>
            <dl className="space-y-5">
              <ProjectMeta label="Location" value={project.location} />
              <ProjectMeta label="Year" value={project.year} />
              <ProjectMeta label="Client" value={project.client} />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent>
            <p className="page-eyebrow">Overview</p>
            <p className="mt-4 text-xl font-medium leading-9 tracking-[-0.02em]">
              {project.overview}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-senja-cyan">
          <CardContent>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">
              Scope of work
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <Badge key={service} className="bg-senja-black text-white">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent>
            <p className="page-eyebrow">01 · Challenge</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">Making complexity invisible.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.challenge}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="page-eyebrow">02 · Solution</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">One seamless experience.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.solution}</p>
          </CardContent>
        </Card>
      </section>

      {project.stats.length > 0 && (
        <section>
          <div className="mb-5">
            <p className="page-eyebrow">Project impact</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">Key statistics</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.stats.map((stat, index) => (
              <Card key={`${stat.label}-${index}`}>
                <CardContent>
                  <p className="text-4xl font-black tracking-[-0.05em]">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {project.partners.length > 0 && (
        <section>
          <div className="mb-5">
            <p className="page-eyebrow">Technology ecosystem</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">Project partners</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {project.partners.map((partner, index) => (
              <Link
                key={`${partner.slug}-${index}`}
                href={`/partners/${partner.slug}`}
                className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(18,18,18,0.06)] transition-transform hover:-translate-y-1"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-senja-black text-lg font-black text-senja-cyan">
                  {partner.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-bold">{partner.name}</span>
                  <span className="text-xs text-muted-foreground">View partner →</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="page-eyebrow">Project gallery</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">Documented views</h2>
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {project.gallery.length.toString().padStart(2, "0")} images
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {project.gallery.map((image, index) => (
            <Card key={`${image.src}-${index}`}>
              <CardContent>
                <ProjectImage
                  src={image.src}
                  alt={image.alt}
                  className="h-64 object-cover"
                  position={image.position}
                />
                <div className="mt-4 flex gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProjectMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{label}</dt>
      <dd className="mt-1 text-xl font-black">{value}</dd>
    </div>
  )
}

function ProjectImage({
  src,
  alt,
  className,
  position,
}: {
  src: string
  alt: string
  className: string
  position?: string
}) {
  const [hasError, setHasError] = React.useState(false)

  if (!src || hasError) {
    return (
      <div className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-muted-foreground ${className}`}>
        <ImageOffIcon className="size-8" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`w-full rounded-2xl ${className}`}
      style={{ objectPosition: position }}
    />
  )
}

function ProjectPageSkeleton() {
  return (
    <div className="cms-page animate-pulse">
      <div className="h-32 rounded-3xl bg-muted" />
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-96 rounded-3xl bg-muted" />
        <div className="h-96 rounded-3xl bg-muted" />
      </div>
    </div>
  )
}
