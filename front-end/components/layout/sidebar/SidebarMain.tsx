"use client";

import { LucideIcon } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

export function SidebarMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-4 mt-15">
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`p-5 cursor-pointer gap-5 transition duration-300 ease-in-out hover:text-orange-400 hover:bg-transparent ${
                    isActive ? "text-orange-600 font-semibold" : ""
                  }`}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="font-medium capitalize">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
