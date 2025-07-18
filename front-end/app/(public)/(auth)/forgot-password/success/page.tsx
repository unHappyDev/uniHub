import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ForgotPasswordSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Password Reset Sent</CardTitle>
        </CardHeader>
        <CardContent>
          {email ? (
            <>
              If an account with <span className="font-bold">{email}</span>{" "}
              exists, you’ll receive a reset link shortly.
            </>
          ) : (
            "If an account with that email exists, you’ll receive a reset link shortly."
          )}
        </CardContent>
      </Card>
    </div>
  );
}
