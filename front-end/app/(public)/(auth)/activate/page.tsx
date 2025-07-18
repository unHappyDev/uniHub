"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi, getErrorObject } from "@/lib/api/auth";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          "Invalid activation link. Please check your email for the correct link.",
        );
        return;
      }

      setStatus("loading");
      setMessage("Activating your account...");

      try {
        await authApi.activate(token);
        setStatus("success");
        setMessage("Your account has been successfully activated!");
      } catch (e: unknown) {
        const error = getErrorObject(e);

        setStatus("error");

        const { message, action } = error;
        setMessage(`${message} ${action}`);
      }
    };
    if (token && status === "idle") {
      activateAccount();
    }
  }, [status, token]);

  const resendActivationEmail = async () => {
    if (!token) return;

    setResending(true);
    setResendSuccess(false);

    try {
      await authApi.resendActivationByToken(token);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      setMessage("Failed to resend activation email. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Account Activation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {status === "loading" && (
              <div className="py-8">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">{message}</p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <Button asChild className="w-full">
                  <Link href="/login">Sign In to Your Account</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>

                {token && (
                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={resendActivationEmail}
                      disabled={resending}
                    >
                      {resending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Activation Email"
                      )}
                    </Button>

                    {resendSuccess && (
                      <Alert className="mt-4">
                        <AlertDescription>
                          Activation email sent successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                <div className="flex gap-2 justify-center mt-6">
                  <Button asChild variant="secondary">
                    <Link href="/">Home</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register Again</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
