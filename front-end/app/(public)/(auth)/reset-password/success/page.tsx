import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="relative text-center w-full max-w-md bg-[#1a1a1dc3] border border-orange-400/40">
        <CardHeader>
          <CardTitle>Redefinição de senha</CardTitle>
        </CardHeader>
        <CardContent>
          Sua senha foi redefinida com sucesso.
          <div className="mt-4">
            <button className="bg-orange-500/70 hover:bg-orange-600/70 text-white font-semibold px-6 py-2 rounded-xl transition-all uppercase cursor-pointer">
              <Link href="/login">Vá para o Login</Link>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
