"use client";

import { LucideIcon } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SidebarMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 4px rgba(249, 115, 22, 0.25), 0 0 8px rgba(249, 115, 22, 0.1);
          }
          50% {
            box-shadow: 0 0 10px rgba(249, 115, 22, 0.45), 0 0 16px rgba(249, 115, 22, 0.15);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
      `}</style>

      <SidebarMenu className="space-y-2 mt-4">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "flex items-center gap-4 mb-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out border",
                    isActive
                      ? "bg-gradient-to-r from-orange-500/20 to-yellow-400/10 text-orange-400 shadow-inner shadow-orange-500/20 border-orange-500/10 hover:from-orange-500/25 hover:to-yellow-400/15 hover:text-orange-300 animate-pulse-glow"
                      : "text-gray-300 hover:text-orange-300 hover:bg-orange-500/5 hover:border-orange-500/10 border-transparent"
                  )}
                >
                  <a href={item.url} className="flex items-center w-full">
                    {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
                    <span className="truncate">{item.title}</span>
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
