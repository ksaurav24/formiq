 
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar" 
import AuthenticatedProvider from "@/components/use-Authenticated"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formiq Dashboard - Manage Your Forms & Submissions",
  description: "Access your forms, track submissions, and manage your projects securely on Formiq.",
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {  

  return (
    <AuthenticatedProvider>
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 p-2 lg:p-8">
      <SidebarTrigger variant={"ghost"} size={"lg"} className="fixed scale-125 lg:-mt-7 lg:-ml-7 -ml-1 -mt-1 " />
        {children}
      </main>
    </SidebarProvider>
    </AuthenticatedProvider>
  )
}