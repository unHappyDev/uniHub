import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"

export function DropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="lg:hidden" asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-orange-500 cursor-pointer hover:bg-orange-600"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          mt-2
          w-56 
          rounded-lg 
          shadow-xl 
          border 
          border-zinc-700 
          bg-zinc-900 
          text-white 
          space-y-1 
          p-2
          animate-in 
          fade-in 
          slide-in-from-top-2
        "
        align="end"
      >
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild>
            <a
              href="#"
              className="
                block px-4 py-2 
                rounded-md 
                hover:bg-zinc-800 
                transition-colors 
                cursor-pointer 
                text-sm 
                font-medium
              "
            >
              Início
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href="#about"
              className="
                block px-4 py-2 
                rounded-md 
                hover:bg-zinc-800 
                transition-colors 
                cursor-pointer 
                text-sm 
                font-medium
              "
            >
              Quem somos
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href="#services"
              className="
                block px-4 py-2 
                rounded-md 
                hover:bg-zinc-800 
                transition-colors 
                cursor-pointer 
                text-sm 
                font-medium
              "
            >
              Serviços
            </a>
          </DropdownMenuItem>

          <div className="pt-2 border-t border-zinc-700 mt-2">
            <Button
              variant="default"
              className="
                w-full 
                bg-orange-500 hover:bg-orange-600 text-white
                font-bold 
                py-2 
                rounded-md 
                transition 
                duration-300
              "
            >
              LOGIN
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
