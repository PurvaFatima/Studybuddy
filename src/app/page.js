import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div>
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
    </div>
  );
}


