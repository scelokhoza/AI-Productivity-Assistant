import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
            <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
              AI Workplace Productivity Assistant
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}