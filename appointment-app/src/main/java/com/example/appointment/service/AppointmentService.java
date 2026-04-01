package com.example.appointment.service;

import com.example.appointment.domain.Appointment;
import com.example.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    // =========================
    // CREATE
    // =========================
    public Appointment create(Appointment appointment) {

        LocalDateTime time = appointment.getAppointmentTime();

        // Enforce :00 or :30
        if (!isValidTime(time)) {
            throw new RuntimeException("Appointments must be on the hour or half-hour");
        }

        // Enforce duration options
        int duration = appointment.getDurationMinutes();
        if (duration != 15 && duration != 30 && duration != 45 && duration != 60) {
            throw new RuntimeException("Duration must be 15, 30, 45, or 60 minutes");
        }

        // Prevent exact duplicate time
        if (repository.existsByAppointmentTime(time)) {
            throw new RuntimeException("Time slot already booked");
        }

        // Set default status
        appointment.setStatus("BOOKED");

        return repository.save(appointment);
    }

    // =========================
    // GET ALL
    // =========================
    public List<Appointment> getAll() {
        return repository.findAll();
    }

    // =========================
    // GET BY ID
    // =========================
    public Optional<Appointment> getById(Long id) {
        return repository.findById(id);
    }

    // =========================
    // GET BY DATE
    // =========================
    public List<Appointment> getByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59);

        return repository.findByAppointmentTimeBetween(start, end);
    }

    // =========================
    // CANCEL
    // =========================
    public Appointment cancel(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus("CANCELLED");

        return repository.save(appointment);
    }

    // =========================
    // AVAILABLE SLOTS
    // =========================
    public List<LocalDateTime> getAvailableSlots(LocalDate date, int durationMinutes) {

        List<Appointment> appointments = getByDate(date);
        List<LocalDateTime> availableSlots = new ArrayList<>();

        LocalDateTime startOfDay = date.atTime(8, 0);
        LocalDateTime endOfDay = date.atTime(16, 0);

        for (LocalDateTime slot = startOfDay;
             slot.plusMinutes(durationMinutes).isBefore(endOfDay) ||
                     slot.plusMinutes(durationMinutes).equals(endOfDay);
             slot = slot.plusMinutes(30)) {

            boolean overlaps = false;

            for (Appointment appt : appointments) {

                if ("CANCELLED".equals(appt.getStatus())) continue;

                LocalDateTime apptStart = appt.getAppointmentTime();
                LocalDateTime apptEnd = apptStart.plusMinutes(appt.getDurationMinutes());

                LocalDateTime slotEnd = slot.plusMinutes(durationMinutes);

                boolean conflict =
                        slot.isBefore(apptEnd) &&
                                slotEnd.isAfter(apptStart);

                if (conflict) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                availableSlots.add(slot);
            }
        }

        return availableSlots;
    }

    // =========================
    // DELETE (optional)
    // =========================
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // =========================
    // HELPER
    // =========================
    private boolean isValidTime(LocalDateTime time) {
        int minute = time.getMinute();
        return minute == 0 || minute == 30;
    }
}