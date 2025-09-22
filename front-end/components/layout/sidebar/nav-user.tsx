import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  
} from "@/components/ui/sidebar";

import { useAuthSession } from "@/hooks/useAuthSession";

export function NavUser() {
  const { user, loading } = useAuthSession();
 
  if (loading) return null; 
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarContent>
          <div className="flex items-center gap-6 px-2 py-1">
            <Avatar className="h-11 w-11 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">X</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center leading-tight gap-1">
              <span className="truncate font-medium uppercase">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                <a href="/aluno/dados" className="hover:text-orange-500 transition duration-300 ease-in-out">Meus dados</a>
              </span>
            </div>
          </div>
        </SidebarContent>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}