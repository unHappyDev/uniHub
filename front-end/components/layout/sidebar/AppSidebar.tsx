"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { SidebarMain } from "@/components/layout/sidebar/SidebarMain";
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
    <Sidebar
      className={`
    text-white uppercase
    bg-[#0d0d0f]
    border-r border-orange-400/20
    [&[data-mobile=true]]:!border-r
    [&[data-mobile=true]]:!border-orange-400/50
    [&[data-mobile=true]]:!border-solid
    [&[data-mobile=true]]:!bg-[#0d0d0f]
  `}
      {...props}
    >
      <SidebarHeader className="border-b border-orange-400/20 ">
        <SidebarMenu>
          <SidebarMenuItem className="mt-6">
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 ">
        <SidebarMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="border-t border-orange-400/20 py-6 ">
        <div className="flex justify-center py-2">
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
