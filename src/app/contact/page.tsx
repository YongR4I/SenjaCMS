"use client"

import * as React from "react"
import { EyeIcon, MailIcon, RefreshCwIcon, SearchIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useContactStore } from "@/stores/contact-store"

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

export default function ContactPage() {
  // Laravel-only inbox (zustand contact-store → GET/PATCH/DELETE /contact-inquiries).
  const inquiries = useContactStore((s) => s.inquiries)
  const isLoading = useContactStore((s) => s.isLoading)
  const isStoreLoaded = useContactStore((s) => s.isLoaded)
  const storeError = useContactStore((s) => s.error)
  const loadInquiries = useContactStore((s) => s.load)
  const markRead = useContactStore((s) => s.markRead)
  const removeFromStore = useContactStore((s) => s.remove)
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [localError, setLocalError] = React.useState("")
  const error = localError || storeError || ""

  React.useEffect(() => {
    if (!isStoreLoaded) void loadInquiries()
  }, [isStoreLoaded, loadInquiries])

  const filteredInquiries = React.useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return inquiries

    return inquiries.filter((inquiry) =>
      [inquiry.name, inquiry.email, inquiry.company, inquiry.projectType, inquiry.message]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    )
  }, [inquiries, query])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredInquiries.length / pageSize))
  const visibleInquiries = filteredInquiries.slice((page - 1) * pageSize, page * pageSize)
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPage(1))
    return () => window.cancelAnimationFrame(frame)
  }, [query])

  const removeInquiry = async (id: string) => {
    if (!window.confirm("Delete this contact inquiry?")) return

    try {
      await removeFromStore(id)
      if (expandedId === id) setExpandedId(null)
    } catch {
      setLocalError("Delete gagal. Pastikan kamu punya permission contact-inquiries.delete.")
    }
  }

  const toggleRead = async (id: string, next: "new" | "read") => {
    try {
      await markRead(id, next)
    } catch {
      setLocalError("Update status gagal.")
    }
  }

  return (
    <div className="cms-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Inbox · {inquiries.length.toString().padStart(2, "0")} inquiries</p>
          <h1 className="page-title">Contact inquiries</h1>
          <p className="page-description">Review project inquiries submitted through the Senja contact page.</p>
        </div>
        <Button type="button" size="lg" variant="outline" onClick={() => void loadInquiries()} disabled={isLoading}>
          <RefreshCwIcon className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <div className="relative max-w-lg">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, company, or project..."
          className="pl-11"
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-5">Sender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Project type</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Project brief</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8} className="px-5"><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : null}

              {!isLoading && visibleInquiries.map((inquiry) => (
                <React.Fragment key={inquiry.id}>
                  <TableRow>
                    <TableCell className="px-5">
                      <div className="min-w-40">
                        <p className="font-bold">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.company || "No company"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-48">
                        <a href={`mailto:${inquiry.email}`} className="font-medium hover:text-senja-orange">{inquiry.email}</a>
                        <p className="text-xs text-muted-foreground">{inquiry.phone || "No phone"}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{inquiry.projectType}</Badge></TableCell>
                    <TableCell>{inquiry.timeline || "Not specified"}</TableCell>
                    <TableCell>
                      <p className="max-w-64 truncate text-muted-foreground">{inquiry.message}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(inquiry.createdAt))}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        title="Toggle read/new (Laravel)"
                        onClick={() => void toggleRead(inquiry.id, inquiry.status === "new" ? "read" : "new")}
                      >
                        <Badge className="bg-senja-cyan/15 text-senja-black">{inquiry.status}</Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`View inquiry from ${inquiry.name}`}
                          onClick={() => setExpandedId((current) => current === inquiry.id ? null : inquiry.id)}
                        >
                          <EyeIcon />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Email ${inquiry.name}`}
                          render={<a href={`mailto:${inquiry.email}`} />}
                        >
                          <MailIcon />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Delete inquiry from ${inquiry.name}`}
                          onClick={() => void removeInquiry(inquiry.id)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === inquiry.id ? (
                    <TableRow className="bg-muted/35 hover:bg-muted/35">
                      <TableCell colSpan={8} className="px-5 py-6 whitespace-normal">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Project brief</p>
                        <p className="max-w-4xl whitespace-pre-wrap leading-7">{inquiry.message}</p>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              ))}

              {!isLoading && !error && filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-muted-foreground">
                    {query ? "No inquiries match your search." : "No contact inquiries have been submitted yet."}
                  </TableCell>
                </TableRow>
              ) : null}

              {!isLoading && error ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-destructive">{error}</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {pageCount > 1 && <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredInquiries.length)} of {filteredInquiries.length}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><span className="flex items-center px-2 text-sm font-medium">Page {page} of {pageCount}</span><Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}
    </div>
  )
}
