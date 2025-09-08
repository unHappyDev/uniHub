import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Redefinição de senha</CardTitle>
        </CardHeader>
        <CardContent>
          Sua senha foi redefinida com sucesso.
          <div className="mt-4">
            <Button asChild>
              <Link href="/login">Vá para o Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
