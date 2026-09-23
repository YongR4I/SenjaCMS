"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { PartnerForm } from "@/components/partner-form"
import { Button } from "@/components/ui/button"
import { usePartnerRecord } from "@/hooks/use-partner-record"

export default function EditPartnerPage() {
  const params = useParams<{ slug: string }>()
  const slug = decodeURIComponent(params.slug)
  const { partner, isLoaded } = usePartnerRecord(slug)

  if (!isLoaded) {
    return (
      <div className="cms-page animate-pulse">
        <div className="h-32 rounded-3xl bg-muted" />
        <div className="h-96 rounded-3xl bg-muted" />
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="cms-page items-center justify-center text-center">
        <h1 className="page-title">Partner not found.</h1>
        <Button className="mt-4" render={<Link href="/partners" />}>
          <ArrowLeftIcon /> Back to Partners
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
            aria-label={`Back to ${partner.name}`}
            render={<Link href={`/partners/${partner.slug}`} />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Partners · Edit entry</p>
            <h1 className="page-title">Edit {partner.name}</h1>
            <p className="page-description">
              Update the partner profile, relationship, gallery, and product catalog.
            </p>
          </div>
        </div>
      </div>

      <PartnerForm initialPartner={partner} mode="edit" />
    </div>
  )
}
