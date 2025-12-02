"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Folder,
  HelpCircle,
  Home,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import useProjectStore from "@/store/project.store";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import NewProjectForm from "@/components/projects/newProjectForm";
import ThemeToggle from "./theme-toggle";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);

  const { fetchProjects, projects = [], loading } = useProjectStore();
  const { user, loadSession, signOut} = useAuthStore();

  

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar>
      <SidebarRail />

      <SidebarHeader className="px-2 flex-row items-center justify-between ">
        <Link
          href="/"
          className="text-sidebar-foreground flex items-center gap-2 rounded-md px-2 py-2 text-base font-semibold outline-hidden"
        >
          <span className="truncate capitalize">formiQ
          </span>

        </Link>
            <ThemeToggle />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard"
                    className={
                      isActive("/dashboard")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                  >
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects collapsible */}
              <SidebarMenuItem>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-2 w-full">
                      <Folder />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {loading ? (
                        <SidebarMenuSubItem>
                            {/* skeleton */}
                          <SidebarMenuSubButton>
                            <Skeleton className="h-5 w-full" />
                          </SidebarMenuSubButton> 
                           <SidebarMenuSubButton>
                            <Skeleton className="h-5 w-full" />
                          </SidebarMenuSubButton> 
                           <SidebarMenuSubButton>
                            <Skeleton className="h-5 w-full" />
                          </SidebarMenuSubButton> 
                        </SidebarMenuSubItem>
                      ) : Array.isArray(projects) && projects.length === 0 ? (
                        <SidebarMenuSubItem>
                          <span className="text-sm text-muted-foreground">
                            No projects yet
                          </span>
                        </SidebarMenuSubItem>
                      ) : (
                        Array.isArray(projects) &&
                        projects.map((project) => (
                          <SidebarMenuSubItem key={project.projectId}>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/projects/${project.projectId}`}>
                                {project.name}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      )}

                      {/* New Project Popup */}
                      <SidebarMenuSubItem>
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <SidebarMenuSubButton className="flex items-center gap-2 cursor-pointer">
                              <Plus />
                              <span>New Project</span>
                            </SidebarMenuSubButton>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg p-0 overflow-hidden bg-card rounded-lg shadow-xl">
                            <NewProjectForm onClose={() => setOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2">
        <div className="flex items-center justify-between rounded-md px-2 py-2">
          {user ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="size-8">
                <AvatarImage src={user?.image || "/placeholder-user.jpg"} alt="User avatar" />
                <AvatarFallback>
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n: string) => n.charAt(0).toUpperCase())
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  {user?.name}
                </p>
                <p className="text-sidebar-foreground/70 truncate text-xs">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
             // skeleton avatar and text using Skeleton component
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="size-8">
                <Skeleton className="size-8" />
              </Avatar>
              <div className="min-w-0 space-y-1">
                <p className="text-sidebar-foreground truncate text-sm font-medium">
                  <Skeleton className="h-4 w-20" />
                </p>
                <p className="text-sidebar-foreground/70 truncate text-xs">
                  <Skeleton className="h-3 w-30" />
                </p>
              </div>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className="ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-1 outline-hidden focus-visible:ring-2"
              aria-label="User menu"
              disabled={!user || signingOut}
            >
              <MoreHorizontal className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               
              <DropdownMenuItem asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 size-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                {signingOut ? (
                  <div className="flex items-center gap-4">
                    <Spinner className="size-4" />
                    Logging out...
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <LogOut className="size-4" />
                    Log out
                  </div>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
