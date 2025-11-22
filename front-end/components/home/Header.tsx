import { Button } from "../ui/button";

export function Header() {
  const hasUserSession = false; // ou lógica real para detectar sessão

  return (
    <header className="h-[120px]">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <a href="/">
            <img src="/imagens/logo.svg" alt="Logo" className="h-20" />
          </a>
        </div>

        <div className="flex gap-2">
          {!hasUserSession && (
            <>
              <a href="/login">
                <Button variant="default" className="px-8 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-md transition duration-300 ease-in-out">Login</Button>
              </a>
              {/* <a href="/register">
                <Button>Register</Button>
              </a> */}
            </>
          )}

        </div>
      </div>
    </header>
  );
}
