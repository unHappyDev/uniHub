"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

import EmailSchema from "@/lib/models/validator/schemas/fields/email";
import PasswordSchema from "@/lib/models/validator/schemas/fields/password";
import { getErrorObject, authApi } from "@/lib/api/auth";

const formSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    try {

      const res = await authApi.login(values);

      console.log("res login:", res);

      localStorage.setItem("token", res.token);

      localStorage.setItem("role", res.role);

      const roleRouteMap: Record<string, string> = {
        admin: "/secretaria",
        professor: "/professor",
        user: "/aluno",
      };

      const role = res.role?.toLowerCase();
      const route = roleRouteMap[role] ?? "/dashboard";

      router.push(route);
    } catch (err) {
      const errorObj = getErrorObject(err);
      const message =
        typeof errorObj === "string"
          ? errorObj
          : errorObj?.message || "Falha no login. Tente novamente.";

      setError(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                Email
              </FormLabel>
              <FormControl>
                <input
                  placeholder="email@example.com"
                  className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none shadow-inner"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                Senha
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="w-full sm:flex-1 bg-[#1a1a1dc3] border border-orange-400/20 focus:border-orange-400/10 focus:ring-2 focus:ring-orange-500/40 transition-all text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none shadow-inner"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
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
        <div className="flex items-center gap-4 justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-xl transition-all uppercase cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="bg-orange-500/70 hover:bg-orange-600/70 text-white font-semibold px-6 py-2 rounded-xl transition-all uppercase cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </Form>
  );
}
