package com.example.appointment.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;

    private LocalDateTime appointmentTime;

    private int durationMinutes; // 15, 30, 45, 60

    private String status; // BOOKED, CANCELLED

    public Appointment() {}

    public Appointment(Long id, String clientName, LocalDateTime appointmentTime,
                       int durationMinutes, String status) {
        this.id = id;
        this.clientName = clientName;
        this.appointmentTime = appointmentTime;
        this.durationMinutes = durationMinutes;
        this.status = status;
    }

    public Long getId() { return id; }

    public String getClientName() { return clientName; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }

    public int getDurationMinutes() { return durationMinutes; }

    public String getStatus() { return status; }

    public void setId(Long id) { this.id = id; }

    public void setClientName(String clientName) { this.clientName = clientName; }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setStatus(String status) { this.status = status; }
}