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
import { Book, Users, GraduationCap, AlertTriangle, HomeIcon, UserPlus, ListOrdered, BookOpen, FileText, ClipboardList, Clock } from "lucide-react";

const navMain = [
  { title: "Início", url: "/secretaria", icon: HomeIcon },
  { title: "Alunos", url: "/secretaria/alunos", icon: UserPlus },
  { title: "Professores", url: "/secretaria/professor", icon: UserPlus },
  { title: "Matérias", url: "/secretaria/materias", icon: BookOpen },
  { title: "Cursos", url: "/secretaria/cursos", icon: GraduationCap },
  { title: "Turmas", url: "/secretaria/turmas", icon: Users },
  { title: "Notas", url: "/secretaria/notas", icon: FileText },
  { title: "Avisos", url: "/secretaria/avisos", icon: AlertTriangle },
  { title: "Presenças", url: "/secretaria/attendance", icon: ClipboardList },
  { title: "Horários", url: "/secretaria/horario", icon: Clock },
  
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
        <header className="relative flex h-25 items-center px-4 bg-[#0d0d0f] border-b border-orange-500/20">
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
