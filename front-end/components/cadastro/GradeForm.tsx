"use client";

import { useState, useEffect } from "react";
import { CreateGradeDTO } from "@/types/Grade";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  initialData?: CreateGradeDTO;
  onSubmit: (data: CreateGradeDTO) => void;
}

export default function GradeForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<CreateGradeDTO>({
    studentId: "",
    classroomId: "",
    activity: "",
    grade: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {!isEditing && (
        <>
          <Input
            name="studentId"
            value={form.studentId}
            placeholder="ID do estudante"
            onChange={handleChange}
          />

          <Input
            name="classroomId"
            value={form.classroomId}
            placeholder="ID da sala"
            onChange={handleChange}
          />

          <Input
            name="activity"
            value={form.activity}
            placeholder="Atividade"
            onChange={handleChange}
          />
        </>
      )}

      <Input
        name="grade"
        type="number"
        value={form.grade}
        onChange={handleChange}
        placeholder="Nota"
      />

      <Button type="submit" className="w-full uppercase">
        {isEditing ? "Salvar Nota" : "Criar Nota"}
      </Button>
    </form>
  );
}
