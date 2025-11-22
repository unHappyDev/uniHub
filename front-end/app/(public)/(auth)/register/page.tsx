import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-6 border-t pt-4">
              <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
