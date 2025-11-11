"use client";

import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthSession } from "@/hooks/useAuthSession";

import { Separator } from "@radix-ui/react-separator";
import { Book, HomeIcon, AlertTriangle, CalendarDays } from "lucide-react";

const navMain = [
  { title: "início", url: "/professor", icon: HomeIcon },
  { title: "notas", url: "/professor/notas", icon: Book },
  { title: "horário", url: "/professor/horario", icon: CalendarDays},
  { title: "avisos", url: "/professor/avisos", icon: AlertTriangle },
];

const navSecondary = [{ title: "Ajuda", url: "/ajuda" }];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user: sessionUser } = useAuthSession();

 
  const user = sessionUser || {
    name: "",
    email: "",
    avatar: "",
  };
  return (
    <SidebarProvider>
      <AppSidebar user={user} navMain={navMain} navSecondary={navSecondary}>
        {children}
      </AppSidebar>

      <SidebarInset>
        <header className="relative flex h-25 items-center px-4 border-b border-orange-500/40">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <img
            src="/imagens/logo.svg"
            alt="Logo"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-18"
          />
        </header>

        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}