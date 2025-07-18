import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="ml-2 font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Forgot you password?
            <Link
              href="/forgot-password"
              className="ml-2 font-medium text-primary hover:underline"
            >
              Recover
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
