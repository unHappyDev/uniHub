"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { SidebarMain } from "@/components/layout/sidebar/SidebarMain";
import { SidebarSecondary } from "@/components/layout/sidebar/SidebarSecondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoutButton from "@/components/auth/LogoutButton";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItem[];
  navSecondary: NavItem[];
  children: React.ReactNode;
};

export default function AppSidebar({
  user,
  navMain,
  navSecondary,
  children,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mt-8">
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMain items={navMain} />
        {/* <SidebarSecondary items={navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter className="flex items-center justify-center">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
