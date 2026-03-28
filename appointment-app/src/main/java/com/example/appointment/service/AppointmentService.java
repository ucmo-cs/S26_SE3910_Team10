package com.example.appointment.service;

import com.example.appointment.domain.Appointment;
import com.example.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment create(Appointment appointment) {
        return repository.save(appointment);
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public Optional<Appointment> getById(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}