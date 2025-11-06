"use client";

import Home from "@/app/(public)/page";
import AppSidebar from "@/components/layout/sidebar/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthSession } from "@/hooks/useAuthSession";

import { Separator } from "@radix-ui/react-separator";
import { Book, Users, GraduationCap, AlertTriangle, HomeIcon } from "lucide-react";

const navMain = [
  { title: "Início", url: "/secretaria", icon: HomeIcon },
  { title: "Alunos", url: "/secretaria/alunos", icon: Book },
  { title: "Professores", url: "/secretaria/professor", icon: Users },
  { title: "Cursos", url: "/secretaria/cursos", icon: GraduationCap },
  { title: "Matérias", url: "/secretaria/materias", icon: GraduationCap },
  { title: "Post", url: "/secretaria/posts", icon: AlertTriangle },
  
];

const navSecondary = [{ title: "Seus dados", url: "/ajuda" }];



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
            className="mr-2 data-[orientation=vertical]:h-4 "
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
