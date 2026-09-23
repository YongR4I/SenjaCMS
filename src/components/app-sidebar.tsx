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
import { useAuthStore } from "@/stores/auth-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon />, permission: null as string | null },
  { title: "Hero", url: "/hero", icon: <HomeIcon />, permission: "hero.view" },
  { title: "About", url: "/about", icon: <InfoIcon />, permission: "about.view" },
  { title: "Our Works", url: "/our-work", icon: <BriefcaseIcon />, permission: "projects.view" },
  { title: "Partners", url: "/partners", icon: <UsersIcon />, permission: "partners.view" },
  { title: "Contact", url: "/contact", icon: <MailIcon />, permission: "contact-inquiries.view" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const load = useAuthStore((s) => s.load);
  const isLoaded = useAuthStore((s) => s.isLoaded);

  React.useEffect(() => {
    if (!isLoaded) void load();
  }, [isLoaded, load]);

  const visibleNav = NAV_ITEMS.filter(
    (item) => item.permission === null || hasPermission(item.permission),
  );

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
        <NavMain items={visibleNav} />
      </SidebarContent>

      <SidebarFooter>
        <div className="mb-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/55 group-data-[collapsible=icon]:hidden">
          <span className="mb-2 block font-bold text-senja-cyan">Senja CMS</span>
          Shape every digital touchpoint from one focused workspace.
        </div>
        <NavUser
          user={{
            name: user?.name ?? "Senja Admin",
            email: user?.email ?? "admin@senja.id",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
