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
import { technologyPartners, type TechnologyPartner } from "@/data/partners"
import { usePartnersStore } from "@/stores/partners-store"

const textareaClassName =
  "min-h-32 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"

const emptyPartner: TechnologyPartner = {
  slug: "",
  number: String(technologyPartners.length + 1).padStart(2, "0"),
  name: "",
  image: "",
  description: "",
  capabilities: [""],
  relationship: "",
  relationshipDetail: "",
  heroImage: "",
  gallery: [],
  products: [],
}

type PartnerGalleryImage = TechnologyPartner["gallery"][number]

const emptyGalleryImage: PartnerGalleryImage = {
  src: "",
  alt: "",
  position: "",
}

type PartnerProduct = TechnologyPartner["products"][number]

const emptyProduct: PartnerProduct = {
  name: "",
  category: "",
  description: "",
  image: "",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function PartnerForm({
  initialPartner,
  mode = "add",
}: {
  initialPartner?: TechnologyPartner
  mode?: "add" | "edit"
}) {
  const router = useRouter()
  const [form, setForm] = React.useState<TechnologyPartner>(
    initialPartner ?? emptyPartner
  )
  const [isSaving, setIsSaving] = React.useState(false)
  const [galleryDialogOpen, setGalleryDialogOpen] = React.useState(false)
  const [editingGalleryIndex, setEditingGalleryIndex] = React.useState<number | null>(null)
  const [galleryDraft, setGalleryDraft] =
    React.useState<PartnerGalleryImage>(emptyGalleryImage)
  const [productDialogOpen, setProductDialogOpen] = React.useState(false)
  const [editingProductIndex, setEditingProductIndex] = React.useState<number | null>(null)
  const [productDraft, setProductDraft] = React.useState<PartnerProduct>(emptyProduct)
  const capabilityOptions = Array.from(
    new Set(form.capabilities.map((capability) => capability.trim()).filter(Boolean))
  )

  const setField = <Key extends keyof TechnologyPartner>(
    field: Key,
    value: TechnologyPartner[Key]
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const savePartner = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const partner: TechnologyPartner = {
      ...form,
      slug: form.slug.trim() || slugify(form.name),
      capabilities: form.capabilities.map((item) => item.trim()).filter(Boolean),
      gallery: form.gallery.filter((image) => image.src.trim()),
      products: form.products.filter((product) => product.name.trim()),
    }

    try {
      // zustand partners-store: POST/PUT /partners when authed, cache fallback.
      await usePartnersStore.getState().savePartner(partner, initialPartner?.slug)
      router.push(mode === "edit" ? `/partners/${partner.slug}` : "/partners")
      router.refresh()
    } finally {
      setIsSaving(false)
    }
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

  const openAddProduct = () => {
    setEditingProductIndex(null)
    setProductDraft(emptyProduct)
    setProductDialogOpen(true)
  }

  const openEditProduct = (index: number) => {
    setEditingProductIndex(index)
    setProductDraft({ ...form.products[index] })
    setProductDialogOpen(true)
  }

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const product = {
      ...productDraft,
      name: productDraft.name.trim(),
      category: productDraft.category.trim(),
      description: productDraft.description.trim(),
    }

    if (editingProductIndex === null) {
      setField("products", [...form.products, product])
    } else {
      const products = [...form.products]
      products[editingProductIndex] = product
      setField("products", products)
    }

    setProductDialogOpen(false)
  }

  return (
    <form onSubmit={savePartner} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Partner information</CardTitle>
          <CardDescription>
            Primary identity used by the partner directory and detail page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="partner-name">Partner name</FieldLabel>
              <Input
                id="partner-name"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Partner brand"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="partner-slug">Slug</FieldLabel>
              <Input
                id="partner-slug"
                value={form.slug}
                onChange={(event) => setField("slug", slugify(event.target.value))}
                placeholder="Generated from partner name"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="partner-description">Short description</FieldLabel>
              <textarea
                id="partner-description"
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={textareaClassName}
                placeholder="Short introduction displayed in the partner directory."
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <ImageFieldCard
          title="Partner logo"
          description="Brand logo displayed in the partner directory."
          value={form.image}
          onChange={(value) => setField("image", value)}
          aspectRatio={16 / 9}
        />
        <ImageFieldCard
          title="Hero image"
          description="Main visual displayed on the partner detail page."
          value={form.heroImage}
          onChange={(value) => setField("heroImage", value)}
          aspectRatio={16 / 9}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relationship story</CardTitle>
          <CardDescription>Explain how Senja and this partner work together.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="relationship">Relationship headline</FieldLabel>
              <Input
                id="relationship"
                value={form.relationship}
                onChange={(event) => setField("relationship", event.target.value)}
                placeholder="A concise statement about the partnership."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="relationship-detail">Relationship detail</FieldLabel>
              <textarea
                id="relationship-detail"
                value={form.relationshipDetail}
                onChange={(event) => setField("relationshipDetail", event.target.value)}
                className={textareaClassName}
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capabilities</CardTitle>
          <CardDescription>Core capabilities shown on the partner profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.capabilities.map((capability, index) => (
            <div key={index} className="flex gap-2">
              <Input
                aria-label={`Capability ${index + 1}`}
                value={capability}
                onChange={(event) => {
                  const capabilities = [...form.capabilities]
                  capabilities[index] = event.target.value
                  setField("capabilities", capabilities)
                }}
                placeholder="Professional displays"
              />
              <RemoveButton
                label={`Remove capability ${index + 1}`}
                onClick={() =>
                  setField("capabilities", form.capabilities.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            </div>
          ))}
          <AddRowButton
            label="Add capability"
            onClick={() => setField("capabilities", [...form.capabilities, ""])}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Partner gallery</CardTitle>
            <CardDescription>Document the technology in real Senja environments.</CardDescription>
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
                onChange={(src) =>
                  setGalleryDraft((current) => ({ ...current, src }))
                }
              />

              <Field>
                <FieldLabel htmlFor="partner-gallery-alt">Alternative text</FieldLabel>
                <textarea
                  id="partner-gallery-alt"
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
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Products featured on the partner detail page.</CardDescription>
          </div>
          <Button type="button" size="sm" onClick={openAddProduct}>
            <PlusIcon /> Add product
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 px-5">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.products.map((product, index) => (
                <TableRow key={`${product.name}-${index}`}>
                  <TableCell className="px-5">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt=""
                        className="size-12 rounded-xl border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal text-muted-foreground">
                    <p className="line-clamp-2">{product.description || "—"}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => openEditProduct(index)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Remove ${product.name}`}
                        onClick={() =>
                          setField(
                            "products",
                            form.products.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {form.products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No products added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent>
          <form onSubmit={saveProduct} className="flex min-h-0 flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingProductIndex === null ? "Add product" : "Edit product"}
              </DialogTitle>
              <DialogDescription>
                Complete the product information displayed on the partner detail page.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 space-y-4 overflow-y-auto px-6 py-5">
              <Field>
                <FieldLabel htmlFor="product-name">Product name</FieldLabel>
                <Input
                  id="product-name"
                  value={productDraft.name}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Product name"
                  autoFocus
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <select
                  id="product-category"
                  value={productDraft.category}
                  onChange={(event) =>
                    setProductDraft((current) => ({ ...current, category: event.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-input bg-white px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
                  required
                >
                  <option value="" disabled>
                    {capabilityOptions.length === 0
                      ? "Add a capability first"
                      : "Select product category"}
                  </option>
                  {Array.from(
                    new Set([...capabilityOptions, productDraft.category].filter(Boolean))
                  ).map((capability) => (
                    <option key={capability} value={capability}>
                      {capability}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="product-description">Description</FieldLabel>
                <textarea
                  id="product-description"
                  value={productDraft.description}
                  onChange={(event) =>
                    setProductDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={textareaClassName}
                  placeholder="Describe the product and its main use."
                  required
                />
              </Field>

              <CompactImageField
                label="Product image"
                value={productDraft.image}
                onChange={(image) =>
                  setProductDraft((current) => ({ ...current, image }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProductIndex === null ? "Add product" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end gap-2 rounded-3xl border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              mode === "edit" && initialPartner
                ? `/partners/${initialPartner.slug}`
                : "/partners"
            )
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : mode === "edit"
              ? "Update Partner"
              : "Save Partner"}
        </Button>
      </div>
    </form>
  )

}

function ImageFieldCard({
  title,
  description,
  value,
  onChange,
  aspectRatio,
}: {
  title: string
  description: string
  value: string
  onChange: (value: string) => void
  aspectRatio: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageDropzone
          value={value ? [value] : []}
          onChange={(images) => onChange(images.at(-1) ?? "")}
          aspectRatio={aspectRatio}
        />
      </CardContent>
    </Card>
  )
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <PlusIcon /> {label}
    </Button>
  )
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="icon-sm" aria-label={label} onClick={onClick}>
      <Trash2Icon />
    </Button>
  )
}

function CompactImageField({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <p className="text-sm font-medium">{label}</p>
      <ImageDropzone
        compact
        value={value ? [value] : []}
        onChange={(images) => onChange(images.at(-1) ?? "")}
        aspectRatio={16 / 9}
      />
    </div>
  )
}
