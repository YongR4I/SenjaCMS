"use client"

import "./globals.css"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <html lang="en">
      <body>
        {pathname === "/login" ? (
          children
        ) : (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-[calc(100svh-1.5rem)] overflow-hidden bg-background">
              <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center border-b border-black/5 bg-background/85 px-5 backdrop-blur-xl sm:px-7 lg:px-10">
                <SidebarTrigger className="mr-3" />
                <Separator
                  orientation="vertical"
                  className="mr-4 data-vertical:h-5 data-vertical:self-auto"
                />
                <DynamicBreadcrumb />
                <div className="ml-auto hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground sm:flex">
                  <span className="size-2 animate-pulse rounded-full bg-senja-cyan" />
                  Website online
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        )}
      </body>
    </html>
  )
}
