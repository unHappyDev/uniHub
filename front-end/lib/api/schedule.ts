import apiSpring from "./clientSpring";

export interface SchedulePayload {
  scheduleId?: string | null;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
}

export const updateSchedule = async (
  scheduleId: string,
  dto: SchedulePayload,
): Promise<void> => {
  await apiSpring.put(`/schedules/${scheduleId}`, dto);
};

export const createSchedules = async (
  classroomId: string,
  schedules: SchedulePayload[],
): Promise<void> => {
  await apiSpring.post(`/schedules`, { classroomId, schedules });
};

export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await apiSpring.delete(`/schedules/${scheduleId}`);
};
