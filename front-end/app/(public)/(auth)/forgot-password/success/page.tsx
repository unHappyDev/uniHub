import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloseButton } from "@/components/auth/CloseButton";

export default async function ForgotPasswordSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="relative w-full max-w-md text-center bg-[#1a1a1dc3] border border-orange-400/40">

        <CloseButton />

        <CardHeader>
          <CardTitle>Redefinição de senha enviada</CardTitle>
        </CardHeader>

        <CardContent>
          {email ? (
            <>
              Se uma conta com <span className="font-bold">{email}</span>{" "}
              existe, você receberá um link de redefinição em breve.
            </>
          ) : (
            "If an account with that email exists, you’ll receive a reset link shortly."
          )}
        </CardContent>
      </Card>
    </div>
  );
}
