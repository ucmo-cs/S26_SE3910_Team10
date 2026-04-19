package com.team10.appointments.service;

import com.team10.appointments.dto.AppointmentRequest;
import com.team10.appointments.model.Appointment;
import com.team10.appointments.model.AppointmentStatus;
import com.team10.appointments.model.Branch;
import com.team10.appointments.model.Topic;
import com.team10.appointments.repository.AppointmentRepository;
import com.team10.appointments.repository.BranchRepository;
import com.team10.appointments.repository.TopicRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public AppointmentService(AppointmentRepository repository,
                              TopicRepository topicRepository,
                              BranchRepository branchRepository) {
        this.repository = repository;
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
    }

    public List<Appointment> getAll() {
        return repository.findAll();
    }

    public Appointment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found: " + id));
    }

    public Appointment create(AppointmentRequest req) {
        Topic topic = topicRepository.findById(req.getTopicId())
                .orElseThrow(() -> new EntityNotFoundException("Topic not found: " + req.getTopicId()));
        Branch branch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new EntityNotFoundException("Branch not found: " + req.getBranchId()));

        Appointment a = new Appointment();
        a.setTopic(topic);
        a.setBranch(branch);
        a.setDate(req.getDate());
        a.setTime(req.getTime());
        a.setFirstName(req.getFirstName());
        a.setLastName(req.getLastName());
        a.setEmail(req.getEmail());
        a.setPhone(req.getPhone());
        a.setNotes(req.getNotes());
        return repository.save(a);
    }

    public Appointment cancel(Long id) {
        Appointment a = getById(id);
        a.setStatus(AppointmentStatus.CANCELLED);
        return repository.save(a);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Appointment not found: " + id);
        }
        repository.deleteById(id);
    }

    public List<String> getAvailableSlots(Long branchId, LocalDate date) {
        if (!branchRepository.existsById(branchId)) {
            throw new EntityNotFoundException("Branch not found: " + branchId);
        }

        List<String> allSlots = generateSlots();

        Set<String> booked = repository
                .findByBranchIdAndDateAndStatus(branchId, date, AppointmentStatus.SCHEDULED)
                .stream()
                .map(Appointment::getTime)
                .collect(Collectors.toSet());

        return allSlots.stream()
                .filter(slot -> !booked.contains(slot))
                .collect(Collectors.toList());
    }

    private List<String> generateSlots() {
        List<String> slots = new ArrayList<>();
        LocalTime t = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(16, 30);
        while (!t.isAfter(end)) {
            slots.add(t.format(TIME_FMT));
            t = t.plusMinutes(30);
        }
        return slots;
    }
}
