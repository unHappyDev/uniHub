import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuthSession } from "@/hooks/useAuthSession";

export function NavUser() {
  const { user, loading } = useAuthSession();
  if (loading || !user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarContent>
          <div className="flex items-center gap-4 px-3 py-2 mb-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-400/5 hover:from-orange-500/20 transition-all border border-orange-500/10">
            <Avatar className="h-11 w-11 rounded-x border border-orange-500/70 shadow-md">
              <AvatarImage src={user.avatar} alt={user.name} className="rounded-x border border-orange-500/40"/>
              <AvatarFallback className="rounded-xl bg-orange-500/30 text-white">
                {user.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center leading-tight">
              <span className="truncate font-semibold text-white text-sm tracking-wide">
                {user.name}
              </span>
              <a
                href="/aluno/dados"
                className="text-xs text-neutral-400 hover:text-orange-400 transition"
              >
                Meus dados
              </a>
            </div>
          </div>
        </SidebarContent>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
