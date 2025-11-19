import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1a1a1dc3] border border-orange-400/40">
        <CardHeader>
          <div className="flex justify-center items-center mb-4"><img src="/imagens/logo.svg" alt="Logo" className="h-18" /></div>
        </CardHeader>
        <CardContent>
          <LoginForm />
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="ml-2 font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </div> */}
          <div className="mt-4 text-center text-sm">
            Esqueceu sua senha?
            <Link
              href="/forgot-password"
              className="ml-2 font-medium text-sm uppercase text-orange-300/80 tracking-wide hover:underline"
            >
              Recuperar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
