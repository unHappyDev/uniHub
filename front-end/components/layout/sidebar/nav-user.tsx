import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuthSession } from "@/hooks/useAuthSession";

export function NavUser() {
  const { user, loading } = useAuthSession();
  const isMobile = useSidebar();

  if (loading) return null; // ou skeleton
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarContent>
          <div className="flex items-center gap-4 px-2 py-1">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">X</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarContent>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
