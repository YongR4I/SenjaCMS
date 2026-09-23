"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  hero: "Hero",
  about: "About",
  solutions: "Solutions",
  "our-work": "Our Works",
  add: "Add Project",
  partners: "Partners",
  contact: "Contact",
}

function toLabel(segment: string, parent?: string, root?: string) {
  if (segment === "add" && parent === "partners") return "Add Partner"
  if (segment === "edit" && root === "our-work") return "Edit Project"
  if (segment === "edit" && root === "partners") return "Edit Partner"
  if (segment === "edit" && root === "hero") return "Edit Hero"
  if (labelMap[segment]) return labelMap[segment]
  const decoded = decodeURIComponent(segment)
  return decoded
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    return {
      label: toLabel(segment, segments[index - 1], segments[0]),
      href,
      isLast: index === segments.length - 1,
    }
  })

  if (!crumbs.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem className="hidden md:block">
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
