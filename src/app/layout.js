import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header" // header component
import { AppSidebar } from "@/components/app-sidebar"  // sidebar component
import { SidebarProvider } from "@/components/ui/sidebar" // sidebar context

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "StudyBuddy",
  description: "Your Personal Study Companion",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex`}
      >
      <SidebarProvider>
      {/* ---------- Sidebar (sticky on the left) ---------- */}
          <AppSidebar className="w-64 shadow-md border-r hidden md:block h-full sticky top-0" />
      </SidebarProvider> 

        {/* ---------- Main Section (Header + Page Content + Footer) ---------- */}
        <div className="flex flex-col flex-1 h-full">
          {/* Header */}
          <Header className="sticky top-0 z-10 bg-white shadow" />


          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
