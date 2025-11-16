package com.pifsite.application.service;

import com.pifsite.application.repository.ClassroomScheduleRepository;
import com.pifsite.application.exceptions.ResourceNotFoundException;
import com.pifsite.application.repository.ClassroomRepository;
import com.pifsite.application.entities.ClassroomSchedule;
import com.pifsite.application.dto.ClassroomScheduleDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.enums.WeekDay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.Set;

@Service
public class ScheduleService {

    @Autowired
    private ClassroomScheduleRepository scheduleRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    public List<ClassroomScheduleDTO> getAll() {

        List<ClassroomScheduleDTO> schedules = this.scheduleRepository.getAll();

        if (schedules.isEmpty()) {
            throw new ResourceNotFoundException("there is no Schedules in the database");
        }

        return schedules;
    }

    public Set<ClassroomSchedule> createClassroomSchedules(
            UUID classroomId,
            Set<ClassroomScheduleDTO> scheduleDTOs) {

        Classroom classroom = classroomId == null ? null : classroomRepository.findById(classroomId).orElse(null);

        Set<ClassroomSchedule> schedules = scheduleDTOs.stream().map(dto -> {
            ClassroomSchedule sc = new ClassroomSchedule();
            sc.setDayOfWeek(dto.dayOfWeek());
            sc.setStartAt(dto.startAt());
            sc.setEndAt(dto.endAt());
            sc.setClassroom(classroom);
            return sc;
        }).collect(Collectors.toSet());

        if (classroomId != null) {

            return new HashSet<>(scheduleRepository.saveAll(schedules));
        }

        return schedules;
    }

    @Transactional
    public void updateSchedule(UUID scheduleId, ClassroomScheduleDTO dto) {

        ClassroomSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule não encontrado."));

        if (dto.dayOfWeek() != null) {

            WeekDay parsed = dto.dayOfWeek();
            if (parsed == null) {
                throw new RuntimeException("Dia da semana inválido: " + dto.dayOfWeek());
            }
            schedule.setDayOfWeek(parsed);
        }

        if (dto.startAt() != null) {

            schedule.setStartAt(dto.startAt());
        }

        if (dto.endAt() != null) {

            schedule.setEndAt(dto.endAt());
        }

        scheduleRepository.save(schedule);
    }

    @Transactional
    public void deleteSchedule(UUID scheduleId) {
        ClassroomSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule não encontrado."));

        scheduleRepository.delete(schedule);
    }

}
