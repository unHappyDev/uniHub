"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dados() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fakeUser: UserData = {
      id: "123",
      name: "João da Silva",
      email: "joao@email.com",
      role: "secretaria",
    };
    setUser(fakeUser);
    setForm({ name: fakeUser.name, email: fakeUser.email });
  }, []);

  const handleSave = () => {
    toast.success("Dados atualizados com sucesso!");
    setOpen(false);
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">Dados da Conta</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Função:</strong> {user.role}</p>

          <Button onClick={() => setOpen(true)}>Editar Dados</Button>
        </CardContent>
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Editar Dados</h2>

          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
