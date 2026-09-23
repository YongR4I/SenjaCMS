"use client"

import * as React from "react"
import { ArrowDownRightIcon } from "lucide-react"

import type { HeroContent } from "@/data/hero"

export function HeroPreview({ content }: { content: HeroContent }) {
  const [imageIndex, setImageIndex] = React.useState(0)
  const images = content.images.filter(Boolean)
  const activeImage = images[imageIndex]

  React.useEffect(() => {
    if (images.length < 2) return

    const interval = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative isolate min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-senja-black shadow-[0_24px_70px_rgba(18,18,18,0.24)] sm:min-h-[40rem]">
      {activeImage ? (
        // User-provided URLs and data URLs must remain available in the preview.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={activeImage}
          src={activeImage}
          alt="Hero background preview"
          className="absolute inset-0 size-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none"
          }}
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,10,14,0.94)_0%,rgba(2,10,14,0.7)_42%,rgba(2,10,14,0.2)_78%),linear-gradient(0deg,rgba(0,0,0,0.5),transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#23ebff,#ff8a00)]" />

      <div className="relative z-10 flex min-h-[34rem] max-w-5xl flex-col justify-center px-7 py-16 text-white sm:min-h-[40rem] sm:px-12 lg:px-16">
        <p className="mb-6 flex items-center gap-4 text-xs font-black uppercase tracking-[0.24em] text-senja-cyan sm:text-sm">
          <span className="h-px w-10 bg-senja-cyan" />
          {content.eyebrow}
        </p>
        <h2 className="max-w-4xl text-[clamp(2.75rem,7vw,6.8rem)] font-light uppercase leading-[0.9] tracking-[-0.065em]">
          {content.title}
        </h2>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-white/75 sm:text-lg">
          {content.subtitle}
        </p>
        <div className="mt-9 flex w-fit items-center gap-4 rounded-full border border-senja-cyan px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-senja-cyan">
          {content.buttonLabel}
          <ArrowDownRightIcon className="size-4" />
        </div>
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-7 right-7 z-10 flex gap-2" aria-label="Hero image indicator">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setImageIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === imageIndex ? "w-8 bg-senja-cyan" : "w-3 bg-white/45"
              }`}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
