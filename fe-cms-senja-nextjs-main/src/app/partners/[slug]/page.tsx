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
import { usePartnerRecord } from "@/hooks/use-partner-record"

export default function PartnerDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = decodeURIComponent(params.slug)
  const { partner, isLoaded } = usePartnerRecord(slug)

  if (!isLoaded) {
    return <PartnerPageSkeleton />
  }

  if (!partner) {
    return (
      <div className="cms-page items-center justify-center text-center">
        <div className="max-w-md rounded-3xl bg-white p-10 shadow-[0_18px_50px_rgba(18,18,18,0.06)]">
          <p className="page-eyebrow">Partner not found</p>
          <h1 className="page-title">This partner is unavailable.</h1>
          <Button className="mt-6" render={<Link href="/partners" />}>
            <ArrowLeftIcon /> Back to Partners
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
            aria-label="Back to Partners"
            render={<Link href="/partners" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Partner {partner.number}</p>
            <h1 className="page-title">{partner.name}</h1>
            <p className="page-description">{partner.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" render={<a href={`http://localhost:3001/partners/${partner.slug}`} target="_blank" rel="noreferrer" />}>
            <ExternalLinkIcon /> Open website
          </Button>
          <Button render={<Link href={`/partners/${partner.slug}/edit`} />}>
            <PencilIcon /> Edit Partner
          </Button>
        </div>
      </div>

      <section className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardContent>
            <p className="page-eyebrow">Partner logo</p>
            <ImagePreview
              src={partner.image}
              alt={`${partner.name} logo`}
              className="mt-4 h-64 bg-muted/40 object-contain p-8"
            />
            <p className="mt-3 break-all text-xs text-muted-foreground">{partner.image}</p>
          </CardContent>
        </Card>
        <Card className="bg-senja-black text-white">
          <CardContent className="flex min-h-80 flex-col justify-between">
            <div className="flex justify-end">
              <span className="font-mono text-xs text-white/40">{partner.number}</span>
            </div>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-senja-orange">Relationship</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                {partner.relationship}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/60">{partner.relationshipDetail}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardContent>
            <p className="page-eyebrow">Capabilities</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {partner.capabilities.map((capability) => (
                <Badge key={capability} variant="outline" className="h-8 px-3 text-sm">
                  {capability}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="page-eyebrow">Hero image</p>
            <ImagePreview
              src={partner.heroImage}
              alt={`${partner.name} hero`}
              className="mt-4 h-72 object-cover"
            />
            <p className="mt-3 break-all text-xs text-muted-foreground">{partner.heroImage}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="page-eyebrow">Product catalog</p>
            <h2 className="text-2xl font-black tracking-[-0.035em]">Featured products</h2>
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {partner.products.length.toString().padStart(2, "0")} products
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partner.products.map((product, index) => (
            <Card key={`${product.name}-${index}`}>
              <CardContent>
                <ImagePreview
                  src={product.image}
                  alt={product.name}
                  className="mb-5 h-48 bg-muted/40 object-cover"
                />
                <Badge variant="outline">{product.category}</Badge>
                <h3 className="mt-4 text-xl font-black tracking-[-0.03em]">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="page-eyebrow">Partner gallery</p>
          <h2 className="text-2xl font-black tracking-[-0.035em]">Technology in context</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {partner.gallery.map((image, index) => (
            <Card key={`${image.src}-${index}`}>
              <CardContent>
                <ImagePreview
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

function ImagePreview({
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
      <div className={`flex items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground ${className}`}>
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

function PartnerPageSkeleton() {
  return (
    <div className="cms-page animate-pulse">
      <div className="h-32 rounded-3xl bg-muted" />
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 rounded-3xl bg-muted" />
        <div className="h-80 rounded-3xl bg-muted" />
      </div>
    </div>
  )
}
