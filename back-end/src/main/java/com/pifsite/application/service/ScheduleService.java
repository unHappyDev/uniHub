package com.pifsite.application.service;

import com.pifsite.application.repository.ClassroomScheduleRepository;
import com.pifsite.application.entities.ClassroomSchedule;
import com.pifsite.application.dto.ClassroomScheduleDTO;
import com.pifsite.application.entities.Classroom;
import com.pifsite.application.enums.WeekDay;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.UUID;
import java.util.Set;

@Service
public class ScheduleService {

    @Autowired
    private ClassroomScheduleRepository scheduleRepository;

    public Set<ClassroomSchedule> createClassroomSchedules(
            Classroom classroom,
            Set<ClassroomScheduleDTO> scheduleDTOs) {

        Set<ClassroomSchedule> schedules = scheduleDTOs.stream().map(dto -> {
            ClassroomSchedule sc = new ClassroomSchedule();
            sc.setDayOfWeek(WeekDay.fromString(dto.dayOfWeek()));
            sc.setStartAt(dto.startAt());
            sc.setEndAt(dto.endAt());
            sc.setClassroom(classroom);
            return sc;
        }).collect(Collectors.toSet());

        if(classroom == null){
            return schedules;
        }

        return new HashSet<>(scheduleRepository.saveAll(schedules));
    }

    @Transactional
    public void updateSchedule(UUID scheduleId, ClassroomScheduleDTO dto) {

        ClassroomSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule não encontrado."));

        if (dto.dayOfWeek() != null && !dto.dayOfWeek().isBlank()) {

            WeekDay parsed = WeekDay.fromString(dto.dayOfWeek());
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
