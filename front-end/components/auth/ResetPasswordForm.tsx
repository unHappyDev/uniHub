"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
              <FormLabel className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">Nova Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none shadow-inner"
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
              <FormLabel className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none shadow-inner"
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
        <button type="submit" className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white font-semibold px-6 py-2 rounded-xl transition-all uppercase cursor-pointer" disabled={loading}>
          {loading ? "Redefinindo…" : "Redefinir senha"}
        </button>
      </form>
    </Form>
  );
}
