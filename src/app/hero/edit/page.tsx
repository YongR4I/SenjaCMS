"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { HeroForm } from "@/components/hero-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useHeroContent } from "@/hooks/use-hero-content"

export default function EditHeroPage() {
  const { content, isLoaded } = useHeroContent()

  return (
    <div className="cms-page">
      <div className="page-header items-start!">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" aria-label="Back to Hero" render={<Link href="/hero" />}>
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Hero · Content editor</p>
            <h1 className="page-title">Edit Hero</h1>
            <p className="page-description">Update the hero message and background images.</p>
          </div>
        </div>
      </div>

      {isLoaded ? <HeroForm initialContent={content} /> : <Skeleton className="min-h-[42rem] rounded-2xl" />}
    </div>
  )
}
