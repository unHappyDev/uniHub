import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { CloseButton } from "@/components/auth/CloseButton";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="relative w-full max-w-md bg-[#1a1a1dc3] border border-orange-400/40">
        <CloseButton />
        <CardHeader>
          <CardTitle className="text-center">Redefinir senha</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
