import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ModeToggle";

export default function Navbar() {
  const hasUserSession = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between mx-4">
        <Link href="/" className="text-xl font-bold">
          AuthSample
        </Link>
        <div className="flex gap-2">
          <ModeToggle />
          {!hasUserSession && (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
          {hasUserSession && (
            <>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
