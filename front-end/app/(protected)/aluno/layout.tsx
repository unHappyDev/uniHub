"use client";

import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@radix-ui/react-separator";
import { Book, Users, GraduationCap } from "lucide-react";

const navMain = [
  { title: "notas", url: "/secretaria/alunos", icon: Book },
  { title: "horario", url: "/secretaria/cursos", icon: Users },
  { title: "Turmas", url: "/secretaria/turmas", icon: GraduationCap },
];

const navSecondary = [{ title: "Ajuda", url: "/ajuda" }];

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} navMain={navMain} navSecondary={navSecondary}>
        {children}
      </AppSidebar>

      <SidebarInset>
        <header className="relative flex h-25 items-center px-4">
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
