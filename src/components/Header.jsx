import { Bell, User } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb" // <-- from shadcn/ui

export default function Header() {
  return (
    // Sticky header with gradient background
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg sticky top-0 z-20 text-white">
      
      {/* ---------- Left Section: User Info + Breadcrumb ---------- */}
      <div className="flex items-center space-x-6">
        {/* User Avatar & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-lg">John Doe</span>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Study Goals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ---------- Middle Section: Stats ---------- */}
      <div className="flex items-center space-x-6">
        {/* Goals */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-center hover:bg-white/30 transition">
          <span className="text-sm opacity-80">Goals Remaining</span>
          <div className="font-bold text-xl">5</div>
        </div>
        {/* Streak */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-center hover:bg-white/30 transition">
          <span className="text-sm opacity-80">Streak</span>
          <div className="font-bold text-xl">🔥 12 days</div>
        </div>
      </div>

      {/* ---------- Right Section: Notifications ---------- */}
      <div className="relative cursor-pointer hover:scale-110 transition-transform">
        <Bell className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
          3
        </span>
      </div>

    </header>
  )
}
