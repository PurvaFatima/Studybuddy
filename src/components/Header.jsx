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
    // Indigo gradient, glass effect, sticky top
    <header className="flex items-center justify-between px-6 py-3 
      bg-gradient-to-r from-indigo-500/90 via-indigo-600/90 to-indigo-700/90 
      backdrop-blur-md shadow-md sticky top-0 z-20 border-b border-indigo-400/30">
      
      {/* ---------- LEFT SECTION: User Info + Breadcrumb ---------- */}
      <div className="flex items-center space-x-4">
        
        {/* User Avatar + Username */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-indigo-200/30 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-white text-sm">John Doe</span>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink 
                href="#" 
                className="text-indigo-200 hover:text-white transition-colors"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block text-indigo-200/70" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">
                Study Goals
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ---------- RIGHT SECTION: Stats + Notifications ---------- */}
      <div className="flex items-center space-x-4">
        
        {/* Goals Card */}
        <div className="bg-indigo-400/30 border border-indigo-300/40 
          rounded-lg px-3 py-1.5 text-center shadow-sm 
          hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 
          transition duration-200">
          <span className="text-xs text-indigo-100 block">Goals</span>
          <div className="font-semibold text-white text-sm">5</div>
        </div>

        {/* Streak Card */}
        <div className="bg-indigo-400/30 border border-indigo-300/40 
          rounded-lg px-3 py-1.5 text-center shadow-sm 
          hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 
          transition duration-200">
          <span className="text-xs text-indigo-100 block">Streak</span>
          <div className="font-semibold text-white text-sm">🔥 12d</div>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 
            bg-red-500 text-white text-[10px] w-4 h-4 
            flex items-center justify-center rounded-full 
            animate-bounce shadow-md">
            3
          </span>
        </div>
      </div>
    </header>
  )
}
