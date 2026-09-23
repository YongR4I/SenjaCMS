"use client"

import Link from "next/link"
import { PencilIcon } from "lucide-react"

import { HeroPreview } from "@/components/hero-preview"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useHeroContent } from "@/hooks/use-hero-content"

export default function HeroPage() {
  const { content, isLoaded } = useHeroContent()

  return (
    <div className="cms-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Homepage · First impression</p>
          <h1 className="page-title">Hero preview</h1>
          <p className="page-description">Review the opening section exactly as it will appear to visitors.</p>
        </div>
        <Button size="lg" render={<Link href="/hero/edit" />}>
          <PencilIcon />
          Edit Hero
        </Button>
      </div>

      {isLoaded ? <HeroPreview content={content} /> : <Skeleton className="min-h-[40rem] rounded-[1.75rem]" />}
    </div>
  )
}
