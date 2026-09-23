"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { ImageDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  projectCategories,
  projects,
  type Project,
} from "@/data/projects"
import {
  technologyPartners,
  type TechnologyPartner,
} from "@/data/partners"

const PROJECTS_STORAGE_KEY = "senja-cms-projects"
const PARTNERS_STORAGE_KEY = "senja-cms-partners"
const textareaClassName =
  "min-h-32 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"

const emptyProject: Project = {
  slug: "",
  number: String(projects.length + 1).padStart(2, "0"),
  title: "",
  category: "Workplace",
  location: "",
  year: new Date().getFullYear().toString(),
  client: "",
  image: "",
  description: "",
  overview: "",
  challenge: "",
  solution: "",
  services: [""],
  stats: [{ value: "", label: "" }],
  partners: [],
  gallery: [],
  featured: false,
}

type ProjectGalleryImage = Project["gallery"][number]

const emptyGalleryImage: ProjectGalleryImage = {
  src: "",
  alt: "",
  position: "",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ProjectForm({
  initialProject,
  mode = "add",
}: {
  initialProject?: Project
  mode?: "add" | "edit"
}) {
  const router = useRouter()
  const [form, setForm] = React.useState<Project>(initialProject ?? emptyProject)
  const [isSaving, setIsSaving] = React.useState(false)
  const [galleryDialogOpen, setGalleryDialogOpen] = React.useState(false)
  const [editingGalleryIndex, setEditingGalleryIndex] = React.useState<number | null>(null)
  const [galleryDraft, setGalleryDraft] =
    React.useState<ProjectGalleryImage>(emptyGalleryImage)
  const [availablePartners, setAvailablePartners] =
    React.useState<TechnologyPartner[]>(technologyPartners)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedPartners = window.localStorage.getItem(PARTNERS_STORAGE_KEY)
      if (!storedPartners) return

      try {
        setAvailablePartners(JSON.parse(storedPartners) as TechnologyPartner[])
      } catch {
        window.localStorage.removeItem(PARTNERS_STORAGE_KEY)
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const setField = <Key extends keyof Project>(field: Key, value: Project[Key]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const saveProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const project: Project = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      services: form.services.map((service) => service.trim()).filter(Boolean),
      stats: form.stats.filter((stat) => stat.value.trim() || stat.label.trim()),
      partners: form.partners.filter((partner) => partner.name.trim()),
      gallery: form.gallery.filter((image) => image.src.trim()),
    }

    let currentProjects = projects
    const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)

    if (storedProjects) {
      try {
        currentProjects = JSON.parse(storedProjects) as Project[]
      } catch {
        currentProjects = projects
      }
    }

    const originalSlug = initialProject?.slug ?? project.slug
    const nextProjects = [
      project,
      ...currentProjects.filter((item) => item.slug !== originalSlug),
    ]
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(nextProjects))
    router.push(mode === "edit" ? `/our-work/${project.slug}` : "/our-work")
    router.refresh()
  }

  const openAddGalleryImage = () => {
    setEditingGalleryIndex(null)
    setGalleryDraft(emptyGalleryImage)
    setGalleryDialogOpen(true)
  }

  const openEditGalleryImage = (index: number) => {
    setEditingGalleryIndex(index)
    setGalleryDraft({ ...form.gallery[index] })
    setGalleryDialogOpen(true)
  }

  const saveGalleryImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!galleryDraft.src.trim() || !galleryDraft.alt.trim()) return

    const image = {
      ...galleryDraft,
      alt: galleryDraft.alt.trim(),
    }

    if (editingGalleryIndex === null) {
      setField("gallery", [...form.gallery, image])
    } else {
      const gallery = [...form.gallery]
      gallery[editingGalleryIndex] = image
      setField("gallery", gallery)
    }

    setGalleryDialogOpen(false)
  }

  return (
    <form onSubmit={saveProject} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project information</CardTitle>
          <CardDescription>
            Primary information used by the project archive and detail page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="title">Project title</FieldLabel>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  placeholder="Digital Signage Installation"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    setField("category", event.target.value as Project["category"])
                  }
                  className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                >
                  {projectCategories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) => setField("location", event.target.value)}
                  placeholder="Jakarta"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="year">Year</FieldLabel>
                <Input
                  id="year"
                  value={form.year}
                  onChange={(event) => setField("year", event.target.value)}
                  placeholder="2026"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="client">Client</FieldLabel>
                <Input
                  id="client"
                  value={form.client}
                  onChange={(event) => setField("client", event.target.value)}
                  placeholder="Client name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) => setField("slug", slugify(event.target.value))}
                  placeholder="Generated from title"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">Short description</FieldLabel>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={textareaClassName}
                placeholder="Short introduction displayed on the project card."
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured image</CardTitle>
          <CardDescription>
            Main image used on the archive card and project hero. Recommended ratio 16:9.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageDropzone
            value={form.image ? [form.image] : []}
            onChange={(images) => setField("image", images.at(-1) ?? "")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project story</CardTitle>
          <CardDescription>
            Long-form copy displayed on the project detail page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="overview">Overview</FieldLabel>
              <textarea
                id="overview"
                value={form.overview}
                onChange={(event) => setField("overview", event.target.value)}
                className={textareaClassName}
                required
              />
            </Field>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="challenge">Challenge</FieldLabel>
                <textarea
                  id="challenge"
                  value={form.challenge}
                  onChange={(event) => setField("challenge", event.target.value)}
                  className={textareaClassName}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="solution">Solution</FieldLabel>
                <textarea
                  id="solution"
                  value={form.solution}
                  onChange={(event) => setField("solution", event.target.value)}
                  className={textareaClassName}
                  required
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scope of work</CardTitle>
          <CardDescription>Services displayed in the project overview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.services.map((service, index) => (
            <div key={index} className="flex gap-2">
              <Input
                aria-label={`Service ${index + 1}`}
                value={service}
                onChange={(event) => {
                  const services = [...form.services]
                  services[index] = event.target.value
                  setField("services", services)
                }}
                placeholder="Experience design"
              />
              <RemoveButton
                label={`Remove service ${index + 1}`}
                onClick={() =>
                  setField("services", form.services.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            </div>
          ))}
          <AddRowButton
            label="Add service"
            onClick={() => setField("services", [...form.services, ""])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project statistics</CardTitle>
          <CardDescription>Key values highlighted on the detail page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.stats.map((stat, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                aria-label={`Statistic ${index + 1} value`}
                value={stat.value}
                onChange={(event) => {
                  const stats = [...form.stats]
                  stats[index] = { ...stat, value: event.target.value }
                  setField("stats", stats)
                }}
                placeholder="50+"
              />
              <Input
                aria-label={`Statistic ${index + 1} label`}
                value={stat.label}
                onChange={(event) => {
                  const stats = [...form.stats]
                  stats[index] = { ...stat, label: event.target.value }
                  setField("stats", stats)
                }}
                placeholder="Spaces transformed"
              />
              <RemoveButton
                label={`Remove statistic ${index + 1}`}
                onClick={() =>
                  setField("stats", form.stats.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            </div>
          ))}
          <AddRowButton
            label="Add statistic"
            onClick={() => setField("stats", [...form.stats, { value: "", label: "" }])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology partners</CardTitle>
          <CardDescription>
            Select partners from the Partners menu. Their name, slug, and logo are added automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {availablePartners.map((partner) => {
              const isSelected = form.partners.some((item) => item.slug === partner.slug)

              return (
                <label
                  key={partner.slug}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-senja-cyan bg-senja-cyan/10 ring-2 ring-senja-cyan/20"
                      : "border-border bg-muted/25 hover:border-senja-cyan/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setField("partners", [
                          ...form.partners,
                          { name: partner.name, slug: partner.slug, image: partner.image },
                        ])
                      } else {
                        setField(
                          "partners",
                          form.partners.filter((item) => item.slug !== partner.slug)
                        )
                      }
                    }}
                    className="size-4 shrink-0 accent-[#121212]"
                  />
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-senja-black text-sm font-black text-senja-cyan">
                    {partner.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{partner.name}</span>
                    <span className="block text-xs text-muted-foreground">Technology partner</span>
                  </span>
                </label>
              )
            })}
          </div>
          {availablePartners.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No partners available. Add a partner from the Partners menu first.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Project gallery</CardTitle>
            <CardDescription>
              Gallery images require descriptive alt text.
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={openAddGalleryImage}>
            <PlusIcon /> Add image
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 px-5">No.</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Alternative text</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.gallery.map((image, index) => (
                <TableRow key={`${image.src}-${index}`}>
                  <TableCell className="px-5 font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    {image.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.src}
                        alt=""
                        className="h-12 w-20 rounded-xl border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xl whitespace-normal text-muted-foreground">
                    <p className="line-clamp-2">{image.alt}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Edit gallery image ${index + 1}`}
                        onClick={() => openEditGalleryImage(index)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Remove gallery image ${index + 1}`}
                        onClick={() =>
                          setField(
                            "gallery",
                            form.gallery.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {form.gallery.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No gallery images added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent>
          <form onSubmit={saveGalleryImage} className="flex min-h-0 flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingGalleryIndex === null ? "Add gallery image" : "Edit gallery image"}
              </DialogTitle>
              <DialogDescription>
                Upload an image and provide descriptive alternative text.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 space-y-4 overflow-y-auto px-6 py-5">
              <CompactImageField
                label="Gallery image"
                value={galleryDraft.src}
                aspectRatio={16 / 9}
                onChange={(src) =>
                  setGalleryDraft((current) => ({ ...current, src }))
                }
              />

              <Field>
                <FieldLabel htmlFor="gallery-alt">Alternative text</FieldLabel>
                <textarea
                  id="gallery-alt"
                  value={galleryDraft.alt}
                  onChange={(event) =>
                    setGalleryDraft((current) => ({
                      ...current,
                      alt: event.target.value,
                    }))
                  }
                  className={textareaClassName}
                  placeholder="Describe what appears in the image."
                  required
                />
              </Field>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setGalleryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!galleryDraft.src.trim() || !galleryDraft.alt.trim()}
              >
                {editingGalleryIndex === null ? "Add image" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setField("featured", event.target.checked)}
              className="size-4 rounded border-border"
            />
            Show as a featured project
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  mode === "edit" && initialProject
                    ? `/our-work/${initialProject.slug}`
                    : "/our-work"
                )
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : mode === "edit"
                  ? "Update Project"
                  : "Save Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <PlusIcon />
      {label}
    </Button>
  )
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
    >
      <Trash2Icon />
    </Button>
  )
}

function CompactImageField({
  label,
  value,
  onChange,
  aspectRatio,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  aspectRatio: number
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <p className="text-sm font-medium">{label}</p>
      <ImageDropzone
        compact
        value={value ? [value] : []}
        onChange={(images) => onChange(images.at(-1) ?? "")}
        aspectRatio={aspectRatio}
      />
    </div>
  )
}
