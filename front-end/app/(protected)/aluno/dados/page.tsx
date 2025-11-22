"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { getLoggedUser, updateUser } from "@/lib/api/user";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const userSchema = z
  .object({
    name: z.string().min(3, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    password: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password.trim() !== "") {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "As senhas não conferem",
      path: ["confirmPassword"],
    },
  );

export default function Dados() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getLoggedUser();

        const mappedUser: UserData = {
          id: data.id,
          name: data.username,
          email: data.email,
          role: data.role,
        };

        setUser(mappedUser);

        reset({
          name: mappedUser.name,
          email: mappedUser.email,
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados do usuário.");
      }
    }

    loadUser();
  }, [reset]);

  useEffect(() => {
    if (open) {
      reset((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [open, reset]);

  const onSubmit = async (data: any) => {
    if (!user) return;

    const payload: any = {
      name: data.name,
      email: data.email,
      role: user.role,
    };

    if (data.password.trim() !== "") {
      payload.password = data.password;
    }

    try {
      await updateUser(user.id, payload);

      toast.success("Dados atualizados com sucesso!");

      setUser({
        ...user,
        name: data.name,
        email: data.email,
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar os dados.");
    }
  };

  if (!user) return <p className="text-white">Carregando...</p>;

  return (
    <div className="p-8 text-white flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-orange-300/90 uppercase tracking-wide text-center mb-10">
          Informações do Usuário
        </h1>

        <div className="bg-[#1a1a1dd0] backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-orange-400/20 pb-2">
              <span className="text-gray-300">Nome</span>
              <span className="font-medium text-white">{user.name}</span>
            </div>

            <div className="flex justify-between items-center border-b border-orange-400/20 pb-2">
              <span className="text-gray-300">Email</span>
              <span className="font-medium text-white">{user.email}</span>
            </div>

            <div className="flex justify-between items-center border-b border-orange-400/20 pb-2">
              <span className="text-gray-300">Função</span>
              <span className="font-medium text-white">{user.role}</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full mt-6 bg-gradient-to-r from-orange-500/50 to-yellow-400/30 
               hover:from-orange-500/60 hover:to-yellow-400/40
               text-white font-semibold py-3 rounded-xl 
               shadow-md transition-all uppercase cursor-pointer"
          >
            Editar Dados
          </button>
        </div>

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="space-y-6 p-2">
            <h2 className="text-xl font-semibold mb-2 text-center text-orange-300/80 uppercase">
              Editar Dados
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                  Nome
                </label>
                <Input
                  {...register("name")}
                  className="bg-[#1a1a1dc3] border border-orange-400/20 text-white shadow-inner rounded-xl h-10"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                  Email
                </label>
                <Input
                  {...register("email")}
                  className="bg-[#1a1a1dc3] border border-orange-400/20 text-white shadow-inner rounded-xl h-10"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="bg-[#1a1a1dc3] border border-orange-400/20 text-white shadow-inner rounded-xl h-10 pr-10"
                    placeholder="Digite a nova senha"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-[8px] text-gray-300 hover:text-white"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="cursor-pointer" />
                    ) : (
                      <Eye size={20} className="cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium uppercase text-orange-300/80 tracking-wide">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="bg-[#1a1a1dc3] border border-orange-400/20 text-white shadow-inner rounded-xl h-10 pr-10"
                    placeholder="Repita a nova senha"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-[8px] text-gray-300 hover:text-white"
                    onClick={() => setShowConfirm((prev) => !prev)}
                  >
                    {showConfirm ? (
                      <EyeOff size={20} className="cursor-pointer" />
                    ) : (
                      <Eye size={20} className="cursor-pointer" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 
                   hover:from-orange-500/60 hover:to-yellow-400/40 
                   text-white font-semibold px-6 py-3 rounded-xl 
                   transition-all uppercase cursor-pointer"
                  type="submit"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
