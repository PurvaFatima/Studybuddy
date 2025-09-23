import { Bell, User } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Header() {
  return (
    // ---------- Header Wrapper ----------
    // Smaller height, white background, subtle green border and shadow
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-green-100 shadow-sm sticky top-0 z-20">
      
      {/* ---------- LEFT SECTION: User Info + Breadcrumb ---------- */}
      <div className="flex items-center space-x-4">
        
        {/* User Avatar + Username */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <User className="w-5 h-5 text-green-700" />
          </div>
          <span className="font-medium text-gray-800 text-sm">John Doe</span>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#" className="text-gray-500 hover:text-green-600">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-700 font-medium">
                Study Goals
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ---------- RIGHT SECTION: Stats + Notifications ---------- */}
      <div className="flex items-center space-x-4">
        
        {/* Goals Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center shadow-sm hover:shadow transition">
          <span className="text-xs text-green-700 block">Goals</span>
          <div className="font-semibold text-green-800 text-sm">5</div>
        </div>

        {/* Streak Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center shadow-sm hover:shadow transition">
          <span className="text-xs text-green-700 block">Streak</span>
          <div className="font-semibold text-green-800 text-sm">🔥 12d</div>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <Bell className="w-6 h-6 text-green-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
            3
          </span>
        </div>
      </div>
    </header>
  )
}
