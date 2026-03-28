package com.example.appointment.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String service;
    private LocalDateTime appointmentTime;

    // Constructors
    public Appointment() {}

    public Appointment(Long id, String clientName, String service, LocalDateTime appointmentTime) {
        this.id = id;
        this.clientName = clientName;
        this.service = service;
        this.appointmentTime = appointmentTime;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }
}