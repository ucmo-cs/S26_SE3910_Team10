package com.example.appointment.controller;

import com.example.appointment.domain.Appointment;
import com.example.appointment.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(service.create(appointment));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}