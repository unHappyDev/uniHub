"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { getStudents } from "@/lib/api/student";
import { getClassrooms } from "@/lib/api/classroom";
import { Student } from "@/types/Student";
import { Classroom } from "@/types/Classroom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  studentId: z.string().uuid("Selecione um aluno válido"),
  classroomId: z.string().uuid("Selecione uma turma válida"),
  attendanceDate: z.string().min(1, "Campo obrigatório"),
  presence: z.boolean(),
});

export type AttendanceFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: AttendanceFormValues) => void;
  defaultValues?: Partial<AttendanceFormValues>;
}

const formatDateForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

export default function AttendanceForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      studentId: "",
      classroomId: "",
      attendanceDate: formatDateForInput(new Date().toISOString()),
      presence: true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, classroomsData] = await Promise.all([
          getStudents(),
          getClassrooms(),
        ]);

        const mappedStudents: Student[] = studentsData.map((s: any) => ({
          ...s,
          nome: s.nome ?? s.username ?? s.name ?? "",
        }));

        const mappedClassrooms: Classroom[] = classroomsData.map((c: any) => ({
          ...c,
          classroomId: c.classroomId ?? c.id ?? "",
          subject: c.subject ?? c.subjectName ?? "",
          semester: c.semester ?? "",
        }));

        setStudents(mappedStudents);
        setClassrooms(mappedClassrooms);
      } catch (error) {
        console.error("Erro ao carregar alunos ou turmas:", error);
      }
    };

    loadData();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 text-white"
      >
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151a1b] text-white border border-orange-400/40 z-[9999]">
                    {students.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum aluno encontrado
                      </SelectItem>
                    ) : (
                      students.map((student) => (
                        <SelectItem key={student.id} value={student.id!}>
                          {student.nome || "—"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151a1b] text-white border border-orange-400/40 z-[9999]">
                    {classrooms.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhuma turma encontrada
                      </SelectItem>
                    ) : (
                      classrooms.map((classroom) => (
                        <SelectItem
                          key={classroom.classroomId}
                          value={classroom.classroomId}
                        >
                          {classroom.subject} — {classroom.semester}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attendanceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ? formatDateForInput(field.value) : ""}
                  className="w-full bg-[#1a1a1dc3] border border-orange-400/40 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="presence"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between border p-3 rounded-lg bg-[#1a1a1dc3]">
              <FormLabel>Presente?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500/50 to-yellow-400/30 hover:from-orange-500/60 hover:to-yellow-400/40 text-white"
        >
          Salvar
        </Button>
      </form>
    </Form>
  );
}
