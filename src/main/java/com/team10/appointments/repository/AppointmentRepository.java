package com.team10.appointments.repository;

import com.team10.appointments.model.Appointment;
import com.team10.appointments.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByBranchIdAndDateAndStatus(Long branchId, LocalDate date, AppointmentStatus status);
}
