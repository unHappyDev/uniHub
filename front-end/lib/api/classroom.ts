import apiSpring from "./clientSpring";
import { Classroom, CreateClassroomDTO } from "@/types/Classroom";

export const getClassrooms = async (): Promise<Classroom[]> => {
  const response = await apiSpring.get("/classroom");

  // 🔎 Log bruto vindo do backend
  console.log("📥 /classroom → recebido do backend:", response.data);

  const mapped = response.data.map((c: any) => {
    
    // 🔎 Log dos alunos antes do mapeamento
    console.log("📘 Students recebidos (raw):", c.students);

    const mappedStudents =
      c.students?.map((s: any) => {
        const mappedStudent = {
          id: s.studentId,
          name: s.name,
          courseName: s.courseName ?? "",
        };

        // 🔎 Log de cada aluno mapeado
        console.log("➡️ Student mapeado:", mappedStudent);

        return mappedStudent;
      }) || [];

    const classroom = {
      classroomId: c.classroomId,
      semester: c.semester,
      professor: c.professor,
      subject: c.subject,
      schedules: c.schedules ?? [],
      students: mappedStudents,
    };

    // 🔎 Log da turma mapeada final
    console.log("🏫 Classroom mapeada:", classroom);

    return classroom;
  });

  // 🔎 Resultado final
  console.log("📤 /classroom → retornando ao front:", mapped);

  return mapped;
};

export const getClassroomById = async (id: string): Promise<Classroom | undefined> => {
  console.log("🔍 Buscando classroom por ID:", id);
  const all = await getClassrooms();
  const found = all.find(c => c.classroomId === id);
  console.log("🎯 Classroom encontrado:", found);
  return found;
};

export const getClassroomsByProfessor = async (
  professorName?: string,
): Promise<Classroom[]> => {
  console.log("🔍 Filtrando por professor:", professorName);
  const all = await getClassrooms();
  return !professorName ? all : all.filter((c) => c.professor === professorName);
};

export const getClassroomsByStudent = async (
  studentName: string,
): Promise<Classroom[]> => {
  console.log("🔍 Filtrando por aluno:", studentName);
  const all = await getClassrooms();
  return all.filter((c) => c.students.some((s) => s.name === studentName));
};

export const createClassroom = async (dto: CreateClassroomDTO): Promise<void> => {
  console.log("📤 Criando classroom:", dto);
  await apiSpring.post("/classroom", dto);
};

export const updateClassroom = async (id: string, dto: CreateClassroomDTO): Promise<void> => {
  console.log("✏️ Atualizando classroom:", id, dto);
  await apiSpring.put(`/classroom/${id}`, dto);
};

export const addStudentsToClassroom = async (id: string, studentIds: string[]): Promise<void> => {
  console.log("➕ Adicionando alunos:", studentIds, "na turma:", id);
  await apiSpring.put(`/classroom/addStudents/${id}`, studentIds);
};

export const removeStudentsFromClassroom = async (id: string, studentIds: string[]): Promise<void> => {
  console.log("➖ Removendo alunos:", studentIds, "da turma:", id);
  await apiSpring.delete(`/classroom/removeStudents/${id}`, { data: studentIds });
};

export const deleteClassroom = async (id: string): Promise<void> => {
  console.log("🗑️ Deletando classroom:", id);
  await apiSpring.delete(`/classroom/${id}`);
};
