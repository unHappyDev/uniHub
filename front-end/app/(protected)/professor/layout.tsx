"use client";

import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

import { Separator } from "@radix-ui/react-separator";
import { Book, HomeIcon, AlertTriangle, Clock, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navMain = [
  { title: "Início", url: "/professor", icon: HomeIcon },
  { title: "Notas", url: "/professor/notas", icon: Book },
  { title: "Presenças", url: "/professor/chamada", icon: ClipboardList },
  { title: "Horário", url: "/professor/horario", icon: Clock },
  { title: "Avisos", url: "/professor/avisos", icon: AlertTriangle },
];

const navSecondary = [{ title: "Ajuda", url: "/ajuda" }];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const safeUser = user
    ? {
        name: user.username,
        email: user.email,
        avatar: "/imagens/user.svg",
      }
    : {
        name: "",
        email: "",
        avatar: "",
      };

  return (
    <>
      <AppSidebar user={safeUser} navMain={navMain} navSecondary={navSecondary}> {children} </AppSidebar>

      <SidebarInset>
        <header className="relative flex h-25 items-center px-4 bg-[#0d0d0f] border-b border-orange-500/20">
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
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== "PROFESSOR") {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "PROFESSOR") {
    return null;
  }

  return <>{children}</>;
}
