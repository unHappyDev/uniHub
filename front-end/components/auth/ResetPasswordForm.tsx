"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi, getErrorObject } from "@/lib/api/auth";
import TokenSchema from "@/lib/models/validator/schemas/fields/token";
import PasswordSchema from "@/lib/models/validator/schemas/fields/password";
import { Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    token: TokenSchema,
    password: PasswordSchema,
    confirm: PasswordSchema,
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas devem corresponder",
    path: ["confirm"],
  });

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { token, password: "", confirm: "" },
  });

  useEffect(() => {
    if (token) form.setValue("token", token);
  }, [token, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.resetPassword(values.token, values.password);
      if (res.status === 201) {
        router.push("/reset-password/success");
      } else {
        setError("Falha na redefinição. Tente novamente.");
      }
    } catch (err: unknown) {
      const { message } = getErrorObject(err);
      setError(message ?? "Falha na redefinição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4"></EyeOff>
                    ) : (
                      <Eye className="w-4 h-4"></Eye>
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4"></EyeOff>
                    ) : (
                      <Eye className="w-4 h-4"></Eye>
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Redefinindo…" : "Redefinir senha"}
        </Button>
      </form>
    </Form>
  );
}
