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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi, getErrorObject } from "@/lib/api/auth";
import EmailSchema from "@/lib/models/validator/schemas/fields/email";

const schema = z.object({
  email: EmailSchema,
});

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(values.email);
      if (res.status === 201) {
        router.push(
          `/forgot-password/success?email=${encodeURIComponent(values.email)}`,
        );
      } else {
        setError("Request failed. Try again.");
      }
    } catch (err: unknown) {
      const { message } = getErrorObject(err);
      setError(message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
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
          {loading ? "Enviando" : "Enviar link de redefinição"}
        </Button>
      </form>
    </Form>
  );
}
