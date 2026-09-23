"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { ImageDropzone } from "@/components/image-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { HERO_STORAGE_KEY, type HeroContent } from "@/data/hero"

const textareaClassName =
  "min-h-32 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"

export function HeroForm({ initialContent }: { initialContent: HeroContent }) {
  const router = useRouter()
  const [form, setForm] = React.useState(initialContent)
  const [isSaving, setIsSaving] = React.useState(false)

  const setField = <Key extends keyof HeroContent>(field: Key, value: HeroContent[Key]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(form))
    router.push("/hero")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Hero message</CardTitle>
          <CardDescription>Manage the primary message displayed at the top of the website.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="eyebrow">Eyebrow</FieldLabel>
              <Input
                id="eyebrow"
                value={form.eyebrow}
                onChange={(event) => setField("eyebrow", event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <textarea
                id="title"
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className={textareaClassName}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="subtitle">Description</FieldLabel>
              <textarea
                id="subtitle"
                value={form.subtitle}
                onChange={(event) => setField("subtitle", event.target.value)}
                className={textareaClassName}
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero images</CardTitle>
          <CardDescription>Drop, crop, and reorder one or more background images.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Images</FieldLabel>
            <ImageDropzone value={form.images} onChange={(images) => setField("images", images)} />
            <FieldDescription>Images rotate automatically every five seconds in the preview.</FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/hero")}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Hero"}
        </Button>
      </div>
    </form>
  )
}
