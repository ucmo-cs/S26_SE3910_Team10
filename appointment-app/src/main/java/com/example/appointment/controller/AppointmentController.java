package com.example.appointment.controller;

import com.example.appointment.domain.Appointment;
import com.example.appointment.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Appointment> create(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(service.create(appointment));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET BY DATE
    @GetMapping("/by-date")
    public ResponseEntity<List<Appointment>> getByDate(@RequestParam String date) {
        return ResponseEntity.ok(service.getByDate(LocalDate.parse(date)));
    }

    // AVAILABLE SLOTS
    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam String date,
            @RequestParam int duration) {

        return ResponseEntity.ok(
                service.getAvailableSlots(LocalDate.parse(date), duration)
        );
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancel(id));
    }

    // DELETE (optional)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}