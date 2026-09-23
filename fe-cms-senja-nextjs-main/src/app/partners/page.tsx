"use client"

import * as React from "react"
import Link from "next/link"
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  technologyPartners,
  type TechnologyPartner,
} from "@/data/partners"

const PARTNERS_STORAGE_KEY = "senja-cms-partners"

export default function PartnersPage() {
  const [list, setList] = React.useState<TechnologyPartner[]>(technologyPartners)
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedPartners = window.localStorage.getItem(PARTNERS_STORAGE_KEY)
      if (!savedPartners) return

      try {
        setList(JSON.parse(savedPartners) as TechnologyPartner[])
      } catch {
        window.localStorage.removeItem(PARTNERS_STORAGE_KEY)
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const removePartner = (slug: string) => {
    const nextPartners = list.filter((partner) => partner.slug !== slug)
    setList(nextPartners)
    window.localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(nextPartners))
  }
  const filteredList = React.useMemo(() => list.filter((partner) => [partner.name, partner.description, ...partner.capabilities].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [list, query])
  const pageSize = 10
  const pageCount = Math.max(1, Math.ceil(filteredList.length / pageSize))
  const visibleList = filteredList.slice((page - 1) * pageSize, page * pageSize)
  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPage(1))
    return () => window.cancelAnimationFrame(frame)
  }, [query])

  return (
    <div className="cms-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            Ecosystem · {list.length.toString().padStart(2, "0")} partners
          </p>
          <h1 className="page-title">Partners</h1>
          <p className="page-description">
            Manage the technology brands and products displayed on the Senja website.
          </p>
        </div>
        <Button size="lg" render={<Link href="/partners/add" />}>
          <PlusIcon /> Add Partner
        </Button>
      </div>
      <div className="relative max-w-lg"><SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search partner or capability..." className="pl-11" /></div>

      <Card className="overflow-hidden">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 px-5">No.</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Capabilities</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleList.map((partner) => (
                <TableRow key={partner.slug}>
                  <TableCell className="px-5 font-mono text-xs">
                    {partner.number}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-64">
                      <p className="font-bold">{partner.name}</p>
                      <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                        {partner.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-64 flex-wrap gap-1.5">
                      {partner.capabilities.map((capability) => (
                        <Badge key={capability} variant="outline">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {partner.products.length.toString().padStart(2, "0")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`View ${partner.name}`}
                        render={<Link href={`/partners/${partner.slug}`} />}
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Edit ${partner.name}`}
                        render={<Link href={`/partners/${partner.slug}/edit`} />}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Delete ${partner.name}`}
                        onClick={() => removePartner(partner.slug)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No partners available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {pageCount > 1 && <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredList.length)} of {filteredList.length}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><span className="flex items-center px-2 text-sm font-medium">Page {page} of {pageCount}</span><Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}
    </div>
  )
}
