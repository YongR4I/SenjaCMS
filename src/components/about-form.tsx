"use client"

import * as React from "react"
import { CheckIcon, SaveIcon } from "lucide-react"

import { ImageDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  defaultAboutContent,
  type AboutContent,
  type AboutImage,
  type AboutItem,
  type AboutStat,
} from "@/data/about"
import { useAboutStore } from "@/stores/about-store"

const textareaClassName =
  "min-h-28 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"

export function AboutForm() {
  const storeContent = useAboutStore((s) => s.content)
  const isStoreLoaded = useAboutStore((s) => s.isLoaded)
  const storeLoad = useAboutStore((s) => s.load)
  const [form, setForm] = React.useState<AboutContent>(defaultAboutContent)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  React.useEffect(() => {
    if (!isStoreLoaded) void storeLoad()
  }, [isStoreLoaded, storeLoad])

  React.useEffect(() => {
    if (isStoreLoaded) {
      const frame = window.requestAnimationFrame(() => {
        setForm(storeContent)
        setIsLoaded(true)
      })
      return () => window.cancelAnimationFrame(frame)
    }
  }, [isStoreLoaded, storeContent])

  const setSection = <Key extends keyof AboutContent>(
    section: Key,
    value: AboutContent[Key],
  ) => {
    setForm((current) => ({ ...current, [section]: value }))
    setIsSaved(false)
  }

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      // zustand about-store: PUT /about when authed, localStorage offline cache.
      await useAboutStore.getState().save(form)
      setIsSaved(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="cms-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Company · Brand story</p>
          <h1 className="page-title">About</h1>
          <p className="page-description">
            Manage the complete content displayed on the Senja About page.
          </p>
        </div>
        <SaveButton isLoaded={isLoaded} isSaved={isSaved} isSaving={isSaving} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>The opening message and image at the top of the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <TextField
              id="hero-title"
              label="Title"
              value={form.hero.title}
              onChange={(title) => setSection("hero", { ...form.hero, title })}
            />
            <TextareaField
              id="hero-description"
              label="Description"
              value={form.hero.description}
              onChange={(description) => setSection("hero", { ...form.hero, description })}
            />
            <AboutImageField
              label="Hero image"
              value={form.hero.image}
              onChange={(image) => setSection("hero", { ...form.hero, image })}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company story</CardTitle>
          <CardDescription>The “Why we exist” narrative, supporting image, and statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {form.story.paragraphs.map((paragraph, index) => (
              <TextareaField
                key={index}
                id={`story-paragraph-${index}`}
                label={`Paragraph ${index + 1}`}
                value={paragraph}
                onChange={(value) => {
                  const paragraphs = [...form.story.paragraphs]
                  paragraphs[index] = value
                  setSection("story", { ...form.story, paragraphs })
                }}
              />
            ))}
            <AboutImageField
              label="Story image"
              value={form.story.image}
              onChange={(image) => setSection("story", { ...form.story, image })}
            />
            <StatsEditor
              stats={form.story.stats}
              onChange={(stats) => setSection("story", { ...form.story, stats })}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="bg-senja-cyan">
          <CardHeader>
            <CardTitle>Point of view</CardTitle>
            <CardDescription className="text-black/60">The highlighted brand statement.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <TextareaField
                id="quote-text"
                label="Quote"
                value={form.quote.text}
                onChange={(text) => setSection("quote", { ...form.quote, text })}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Principles</CardTitle>
            <CardDescription>The ideas that guide every Senja project.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <ItemsEditor
                label="Principle"
                items={form.principles.items}
                onChange={(items) => setSection("principles", { ...form.principles, items })}
              />
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected capabilities</CardTitle>
          <CardDescription>The systems and services presented under “One partner. Every layer.”</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <TextareaField
              id="capabilities-description"
              label="Description"
              value={form.capabilities.description}
              onChange={(description) => setSection("capabilities", { ...form.capabilities, description })}
            />
            <AboutImageField
              label="Capabilities image"
              value={form.capabilities.image}
              onChange={(image) => setSection("capabilities", { ...form.capabilities, image })}
            />
            <StringListEditor
              label="Service"
              values={form.capabilities.services}
              onChange={(services) => setSection("capabilities", { ...form.capabilities, services })}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How we work</CardTitle>
          <CardDescription>The four-stage process shown on the About page.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <ItemsEditor
              label="Step"
              items={form.process.steps}
              onChange={(steps) => setSection("process", { ...form.process, steps })}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end border-t pt-6">
        <SaveButton isLoaded={isLoaded} isSaved={isSaved} isSaving={isSaving} />
      </div>
    </form>
  )
}

function SaveButton({ isLoaded, isSaved, isSaving }: { isLoaded: boolean; isSaved: boolean; isSaving: boolean }) {
  return (
    <Button type="submit" size="lg" disabled={!isLoaded || isSaving}>
      {isSaved ? <CheckIcon /> : <SaveIcon />}
      {isSaving ? "Saving..." : isSaved ? "Changes saved" : "Save changes"}
    </Button>
  )
}

function TextField({ id, label, value, onChange }: FieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} required />
    </Field>
  )
}

function TextareaField({ id, label, value, onChange }: FieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={textareaClassName}
        required
      />
    </Field>
  )
}

type FieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function AboutImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: AboutImage
  onChange: (value: AboutImage) => void
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <ImageDropzone
        compact
        value={value.src ? [value.src] : []}
        onChange={(images) => onChange({ ...value, src: images.at(-1) ?? "" })}
      />
    </Field>
  )
}

function StatsEditor({ stats, onChange }: { stats: AboutStat[]; onChange: (value: AboutStat[]) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
          <p className="text-sm font-bold">Statistic {index + 1}</p>
          <Input
            aria-label={`Statistic ${index + 1} value`}
            value={stat.value}
            onChange={(event) => {
              const next = [...stats]
              next[index] = { ...stat, value: event.target.value }
              onChange(next)
            }}
            placeholder="50+"
            required
          />
          <Input
            aria-label={`Statistic ${index + 1} label`}
            value={stat.label}
            onChange={(event) => {
              const next = [...stats]
              next[index] = { ...stat, label: event.target.value }
              onChange(next)
            }}
            placeholder="Spaces transformed"
            required
          />
        </div>
      ))}
    </div>
  )
}

function ItemsEditor({ label, items, onChange }: { label: string; items: AboutItem[]; onChange: (value: AboutItem[]) => void }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border bg-muted/20 p-4">
          <p className="text-sm font-bold">{label} {String(index + 1).padStart(2, "0")}</p>
          <Input
            aria-label={`${label} ${index + 1} title`}
            value={item.title}
            onChange={(event) => {
              const next = [...items]
              next[index] = { ...item, title: event.target.value }
              onChange(next)
            }}
            placeholder="Title"
            required
          />
          <textarea
            aria-label={`${label} ${index + 1} description`}
            value={item.description}
            onChange={(event) => {
              const next = [...items]
              next[index] = { ...item, description: event.target.value }
              onChange(next)
            }}
            className={textareaClassName}
            placeholder="Description"
            required
          />
        </div>
      ))}
    </div>
  )
}

function StringListEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {values.map((value, index) => (
        <TextField
          key={index}
          id={`${label.toLowerCase()}-${index}`}
          label={`${label} ${index + 1}`}
          value={value}
          onChange={(nextValue) => {
            const next = [...values]
            next[index] = nextValue
            onChange(next)
          }}
        />
      ))}
    </div>
  )
}

