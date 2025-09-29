"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  Clock,
  GalleryVerticalEnd,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon, // Correct icon import
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// Sidebar data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Command },
    { name: "Sales & Marketing", url: "#", icon: Clock },
    { name: "Travel", url: "#", icon: AudioWaveform },
  ],
  navMain: [
    { title: "Home", url: "/", icon: HomeIcon },
    { title: "Resources", url: "/resources", icon: BookOpen },
    { title: "Study Timer", url: "/study-timer", icon: Clock },
  ],
}

export function AppSidebar({ ...props }) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-between">
        <TeamSwitcher teams={data.teams} />
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[#E9E6F7] transition"
          aria-label="Toggle Sidebar"
        >
          {state === "expanded" ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeBgColor="#D6D0EF"
          hoverBgColor="#E9E6F7"
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
