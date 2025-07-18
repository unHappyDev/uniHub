"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { Alert, AlertDescription } from "../ui/alert";

export default function RegisterSuccess({ email }: { email: string }) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const resendActivationEmail = async () => {
    setStatus("loading");

    try {
      await authApi.resendActivationByEmail(email);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-center mt-4">Account Created!</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent an activation link to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Mail className="h-5 w-5 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium">Check your inbox</h3>
              <p className="text-sm mt-1">
                We&apos;ve sent an email to{" "}
                <span className="font-bold">{email}</span> with an activation
                link.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <div className="mb-4 text-sm text-muted-foreground">
            {!email && (
              <span>
                Didn&apos;t receive the email? Check your spam folder.
              </span>
            )}
            {email && (
              <>
                <p>Didn&apos;t receive the email? Check your spam folder or</p>
                <Button
                  variant="link"
                  className="w-full"
                  onClick={resendActivationEmail}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "resend activation email"
                  )}
                </Button>

                {status === "success" && (
                  <Alert className="mt-4">
                    <AlertDescription>
                      Activation email sent successfully!
                    </AlertDescription>
                  </Alert>
                )}
                {status === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                      Failed to resend activation email. Please try again later.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
          <div className="border-t pt-4">
            <p className="mb-2">Already activated your account?</p>
            <Button asChild>
              <Link href="/login">Sign In Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
