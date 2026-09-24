"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ImagePlusIcon, XIcon, CropIcon, RotateCcwIcon, ZoomInIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ImageDropzoneProps = {
  value?: string[]
  onChange?: (dataUrls: string[]) => void
  aspectRatio?: number
  className?: string
  compact?: boolean
}

const CROP_FRAME_WIDTH = 720

export function ImageDropzone({
  value = [],
  onChange,
  aspectRatio = 16 / 9,
  className,
  compact = false,
}: ImageDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [cropSrc, setCropSrc] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const pendingFiles = React.useRef<File[]>([])

  const openFile = () => inputRef.current?.click()

  const queueFiles = (files: FileList | null) => {
    const images = Array.from(files ?? []).filter((f) =>
      f.type.startsWith("image/")
    )
    if (!images.length) return
    pendingFiles.current = images
    const reader = new FileReader()
    reader.onload = () => setCropSrc(reader.result as string)
    reader.readAsDataURL(images[0])
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    queueFiles(e.dataTransfer.files)
  }

  const handleCropped = async (dataUrl: string) => {
    // Prefer Laravel storage (POST /uploads) when authed; else keep local dataURL.
    let nextSrc = dataUrl
    try {
      const { getToken, uploadImageBE } = await import("@/lib/api");
      if (getToken()) {
        setIsUploading(true)
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], `senja-${Date.now()}.png`, { type: blob.type || "image/png" })
        const uploaded = await uploadImageBE(file)
        if (uploaded.url) nextSrc = uploaded.url
      }
    } catch {
      // offline / upload failed → keep local dataURL so work is not lost
    } finally {
      setIsUploading(false)
    }

    const next = [...value, nextSrc]
    pendingFiles.current = pendingFiles.current.slice(1)
    if (pendingFiles.current.length) {
      const reader = new FileReader()
      reader.onload = () => setCropSrc(reader.result as string)
      reader.readAsDataURL(pendingFiles.current[0])
      onChange?.(next)
    } else {
      setCropSrc(null)
      pendingFiles.current = []
      onChange?.(next)
    }
  }

  const removeImage = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index))
  }

  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange?.(next)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => queueFiles(e.target.files)}
      />

      {value.length > 0 && (
        <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", compact && "grid-cols-1 sm:grid-cols-2")}>
          {value.map((src, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="aspect-video w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  onClick={() => setCropSrc(src)}
                  aria-label="Crop image"
                >
                  <CropIcon />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  <XIcon />
                </Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  onClick={() => reorder(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move left"
                >
                  ◀
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  onClick={() => reorder(index, index + 1)}
                  disabled={index === value.length - 1}
                  aria-label="Move right"
                >
                  ▶
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openFile}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "flex h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 text-center text-sm font-medium text-muted-foreground transition-all hover:border-senja-cyan hover:bg-senja-cyan/5",
          compact && "h-28",
          dragActive && "border-senja-cyan bg-senja-cyan/10 text-foreground"
        )}
      >
        <ImagePlusIcon className="size-8" />
        <span>
          {isUploading ? "Uploading to Laravel storage…" : "Drag & drop images here, or click to browse"}
        </span>
      </button>

      {cropSrc && (
        <CropModal
          src={cropSrc}
          aspectRatio={aspectRatio}
          onCancel={() => {
            setCropSrc(null)
            pendingFiles.current = []
          }}
          onApply={handleCropped}
        />
      )}
    </div>
  )
}

function CropModal({
  src,
  aspectRatio,
  onCancel,
  onApply,
}: {
  src: string
  aspectRatio: number
  onCancel: () => void
  onApply: (dataUrl: string) => void
}) {
  const imageRef = React.useRef<HTMLImageElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  const [baseScale, setBaseScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [natural, setNatural] = React.useState({ w: 0, h: 0 })
  const [displayScale, setDisplayScale] = React.useState(1)
  const [loadError, setLoadError] = React.useState(false)
  const drag = React.useRef<{
    x: number
    y: number
    ox: number
    oy: number
  } | null>(null)

  const frame = React.useMemo(() => {
    const baseW = Math.min(CROP_FRAME_WIDTH, 720)
    return { w: baseW, h: baseW / aspectRatio }
  }, [aspectRatio])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const width = el.getBoundingClientRect().width
      if (width > 0) setDisplayScale(width / frame.w)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [frame.w])

  const apply = () => {
    const img = imageRef.current
    if (!img || !natural.w) return
    const outputW = Math.round(Math.min(natural.w, frame.w))
    const outputH = Math.round(outputW / aspectRatio)
    const canvas = document.createElement("canvas")
    canvas.width = outputW
    canvas.height = outputH
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const ratio = outputW / frame.w
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, outputW, outputH)
    const drawW = natural.w * scale * ratio
    const drawH = natural.h * scale * ratio
    const dx = outputW / 2 + offset.x * ratio - drawW / 2
    const dy = outputH / 2 + offset.y * ratio - drawH / 2
    ctx.drawImage(img, dx, dy, drawW, drawH)
    onApply(canvas.toDataURL("image/png"))
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCancel])

  const resetPosition = () => {
    setOffset({ x: 0, y: 0 })
    setScale(baseScale)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const factor = displayScale || 1
    setOffset({
      x: drag.current.ox + (e.clientX - drag.current.x) / factor,
      y: drag.current.oy + (e.clientY - drag.current.y) / factor,
    })
  }
  const onPointerUp = () => {
    drag.current = null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col gap-5 overflow-y-auto rounded-2xl border border-border bg-background p-4 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Crop image</h3>
            <p className="mt-1 text-sm text-muted-foreground">Drag the image to adjust the framing.</p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {Math.round(aspectRatio * 100) / 100}:1 ratio
          </span>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-xl bg-muted shadow-inner ring-1 ring-black/10 touch-none"
          style={{ aspectRatio: aspectRatio, maxHeight: "min(62dvh, 520px)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt="Crop"
            className="pointer-events-none absolute max-w-none select-none"
            style={{
              width: natural.w * scale * displayScale,
              height: natural.h * scale * displayScale,
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${offset.x * displayScale}px), calc(-50% + ${offset.y * displayScale}px))`,
            }}
            onLoad={(e) => {
              const w = e.currentTarget.naturalWidth
              const h = e.currentTarget.naturalHeight
              if (!w || !h) {
                setLoadError(true)
                return
              }
              const coverScale = Math.max(frame.w / w, frame.h / h)
              setNatural({ w, h })
              setBaseScale(coverScale)
              setScale(coverScale)
              setOffset({ x: 0, y: 0 })
              setLoadError(false)
            }}
            onError={() => setLoadError(true)}
            draggable={false}
          />

          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80 p-4 text-center">
              <p className="text-sm font-medium text-foreground">Image could not be loaded</p>
              <p className="text-xs text-muted-foreground">
                The source may be unreachable. Close this dialog and try uploading again.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="crop-zoom" className="flex items-center gap-2 text-sm font-medium">
              <ZoomInIcon className="size-4 text-muted-foreground" />
              Zoom
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={resetPosition} className="h-8 gap-1.5 px-2.5 text-xs">
              <RotateCcwIcon className="size-3.5" />
              Reset
            </Button>
          </div>
          <input
            id="crop-zoom"
            type="range"
            min={baseScale}
            max={baseScale * 3}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            aria-label="Zoom image"
            className="w-full accent-senja-cyan"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Fit</span>
            <span>Drag to reposition</span>
            <span>3×</span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={apply} disabled={!natural.w} className="sm:min-w-28">
            Apply
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
