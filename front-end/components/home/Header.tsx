import { DropdownDemo } from "../Dropdown";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className=" h-[120px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <a href="">
            <img src="/imagens/logo.svg" alt="Logo" className="h-20" />
          </a>
        </div>

        {/* <nav className="text-white hidden lg:block">
          <ul className="flex items-center gap-16 text-lg font-medium">
            <li>
              <a
                href="#"
                className="group relative uppercase font-light text-lg text-white hover:text-orange-600 transition-colors duration-300 ease-in-out"
              >
                Início
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-orange-600 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="group relative uppercase font-light text-lg text-white hover:text-orange-600 transition-colors duration-300 ease-in-out"
              >
                Quem somos
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-orange-600 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a
                href="#service"
                className="group relative uppercase font-light text-lg text-white hover:text-orange-600 transition-colors duration-300 ease-in-out"
              >
                Serviços
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-orange-600 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </a>
            </li>
          </ul>
        </nav> */}

        <Button
          variant="default"
          className=" px-8 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-md transition duration-300 ease-in-out"
        >
          LOGIN
        </Button>

        {/* <DropdownDemo /> */}
      </div>
    </header>
  );
}
