import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudyBuddy",
  description: "Your Personal Study Companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Accessible skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-indigo-600 focus:text-white focus:px-3 focus:py-2 rounded"
        >
          Skip to content
        </a>

        <SidebarProvider>
          <div className="flex flex-1 min-h-screen">
            {/* Sidebar */}
            <AppSidebar className="w-64 shadow-md border-r min-h-screen sticky top-0" />

            {/* Main content wrapper (Header + Page + Footer) */}
            <div className="flex flex-col flex-1">
              {/* Sticky header */}
              <Header className="sticky top-0 z-10 bg-white shadow" />

              {/* Page content */}
              <main
                id="main-content"
                className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 pt-20" // pt-20 = header height
              >
                {children}
              </main>

              {/* Footer */}
              <Footer contactEmail="hello@studybuddy.app" variant="muted" />
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
