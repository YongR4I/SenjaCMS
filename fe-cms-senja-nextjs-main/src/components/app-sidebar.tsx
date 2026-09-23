"use client"

import * as React from "react"
import Link from "next/link"
import {
  BriefcaseIcon,
  HomeIcon,
  InfoIcon,
  LayoutDashboardIcon,
  MailIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Senja Admin",
    email: "admin@senja.id",
    avatar: "",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    { title: "Hero", url: "/hero", icon: <HomeIcon /> },
    { title: "About", url: "/about", icon: <InfoIcon /> },
    { title: "Our Works", url: "/our-work", icon: <BriefcaseIcon /> },
    { title: "Partners", url: "/partners", icon: <UsersIcon /> },
    { title: "Contact", url: "/contact", icon: <MailIcon /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-auto px-2 py-2 hover:bg-white/5 hover:text-white"
              render={<Link href="/dashboard" />}
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-senja-cyan text-senja-black">
                <span className="text-lg font-black">S</span>
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-lg font-black tracking-[-0.04em]">SENJA</span>
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Content Studio
                </span>
              </div>
              <span className="senja-dot mr-4" aria-hidden="true" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <div className="mb-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/55 group-data-[collapsible=icon]:hidden">
          <span className="mb-2 block font-bold text-senja-cyan">Senja CMS</span>
          Shape every digital touchpoint from one focused workspace.
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
