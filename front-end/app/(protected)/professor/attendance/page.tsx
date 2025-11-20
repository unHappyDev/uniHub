"use client";

import { useEffect, useState } from "react";
import { Attendance, CreateAttendanceDTO } from "@/types/Attendance";
import AttendanceForm from "@/components/cadastro/AttendanceForm";
import AttendanceTable from "@/components/cadastro/AttendanceTable";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import {
  getAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "@/lib/api/attendance";

const formatDateForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selected, setSelected] = useState<Attendance | null>(null);
  const [open, setOpen] = useState(false);

  const loadAttendances = async () => {
    try {
      const data = await getAttendances();
      setAttendances(data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setAttendances([]);
      } else {
        console.error("Erro ao buscar presenças:", error);
      }
    }
  };

  useEffect(() => {
    loadAttendances();
  }, []);

  const handleCreateOrUpdate = async (formData: CreateAttendanceDTO) => {
    try {
      const payload = {
        ...formData,
        attendanceDate: new Date(formData.attendanceDate).toISOString(),
      };

      if (selected) {
        await updateAttendance(selected.id, payload);
        toast.success("Presença atualizada!");
      } else {
        await createAttendance(payload);
        toast.success("Presença criada!");
      }

      setOpen(false);
      setSelected(null);
      await loadAttendances();
    } catch (err: any) {
      console.error("Erro:", err.response?.data || err);
      toast.error("Erro ao salvar presença: " + (err.response?.data || ""));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttendance(id);
      toast.success("Presença deletada!");
      await loadAttendances();
    } catch {
      toast.error("Erro ao deletar presença");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gerenciar Presenças</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Nova Presença
        </button>
      </div>

      <AttendanceTable
        data={attendances}
        onEdit={(att) => {
          setSelected(att);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {selected ? "Editar Presença" : "Registrar Presença"}
        </h2>
        <AttendanceForm
          onSubmit={handleCreateOrUpdate}
          defaultValues={
            selected
              ? {
                  studentId: "", 
                  classroomId: "",
                  attendanceDate: formatDateForInput(selected.attendanceDate),
                  presence: selected.presence,
                }
              : undefined
          }
        />
      </Modal>
    </div>
  );
}
