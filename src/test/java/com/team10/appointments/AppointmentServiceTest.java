package com.team10.appointments;

import com.team10.appointments.dto.AppointmentRequest;
import com.team10.appointments.model.Appointment;
import com.team10.appointments.model.AppointmentStatus;
import com.team10.appointments.model.Branch;
import com.team10.appointments.model.Topic;
import com.team10.appointments.repository.AppointmentRepository;
import com.team10.appointments.repository.BranchRepository;
import com.team10.appointments.repository.TopicRepository;
import com.team10.appointments.service.AppointmentService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository repository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private BranchRepository branchRepository;

    @InjectMocks
    private AppointmentService service;

    private Topic sampleTopic;
    private Branch sampleBranch;
    private Appointment sampleAppointment;

    @BeforeEach
    void setUp() {
        sampleTopic = new Topic();
        sampleTopic.setName("Loan Consultation");

        sampleBranch = new Branch();
        sampleBranch.setName("Downtown Branch");
        sampleBranch.setAddress("123 Main St");

        sampleAppointment = new Appointment();
        sampleAppointment.setTopic(sampleTopic);
        sampleAppointment.setBranch(sampleBranch);
        sampleAppointment.setDate(LocalDate.of(2024, 6, 15));
        sampleAppointment.setTime("10:00");
        sampleAppointment.setFirstName("John");
        sampleAppointment.setLastName("Smith");
        sampleAppointment.setEmail("john.smith@example.com");
        sampleAppointment.setPhone("555-1234");
    }

    @Test
    void getAll_returnsAllAppointments() {
        when(repository.findAll()).thenReturn(List.of(sampleAppointment));

        List<Appointment> result = service.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    void getById_returnsAppointment_whenFound() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleAppointment));

        Appointment result = service.getById(1L);

        assertThat(result.getEmail()).isEqualTo("john.smith@example.com");
    }

    @Test
    void getById_throwsEntityNotFoundException_whenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void create_savesAppointmentWithScheduledStatus() {
        AppointmentRequest req = buildRequest();
        when(topicRepository.findById(1L)).thenReturn(Optional.of(sampleTopic));
        when(branchRepository.findById(1L)).thenReturn(Optional.of(sampleBranch));
        when(repository.save(any(Appointment.class))).thenReturn(sampleAppointment);

        Appointment result = service.create(req);

        verify(repository, times(1)).save(any(Appointment.class));
        assertThat(result.getTopic().getName()).isEqualTo("Loan Consultation");
    }

    @Test
    void create_throwsEntityNotFoundException_whenTopicNotFound() {
        AppointmentRequest req = buildRequest();
        when(topicRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(req))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Topic");
    }

    @Test
    void create_throwsEntityNotFoundException_whenBranchNotFound() {
        AppointmentRequest req = buildRequest();
        when(topicRepository.findById(1L)).thenReturn(Optional.of(sampleTopic));
        when(branchRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(req))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Branch");
    }

    @Test
    void cancel_updatesStatusToCancelled() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleAppointment));
        when(repository.save(any(Appointment.class))).thenReturn(sampleAppointment);

        Appointment result = service.cancel(1L);

        assertThat(result.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);
        verify(repository).save(sampleAppointment);
    }

    @Test
    void cancel_throwsEntityNotFoundException_whenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.cancel(99L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_callsDeleteById_whenAppointmentExists() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void delete_throwsEntityNotFoundException_whenNotFound() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void getAvailableSlots_returnsAllSlots_whenNoneBooked() {
        when(branchRepository.existsById(1L)).thenReturn(true);
        when(repository.findByBranchIdAndDateAndStatus(eq(1L), any(), eq(AppointmentStatus.SCHEDULED)))
                .thenReturn(List.of());

        List<String> slots = service.getAvailableSlots(1L, LocalDate.of(2024, 6, 15));

        assertThat(slots).hasSize(16); // 09:00–16:30, every 30 min
        assertThat(slots).contains("09:00", "12:00", "16:30");
    }

    @Test
    void getAvailableSlots_excludesBookedSlots() {
        Appointment booked = new Appointment();
        booked.setTime("10:00");

        when(branchRepository.existsById(1L)).thenReturn(true);
        when(repository.findByBranchIdAndDateAndStatus(eq(1L), any(), eq(AppointmentStatus.SCHEDULED)))
                .thenReturn(List.of(booked));

        List<String> slots = service.getAvailableSlots(1L, LocalDate.of(2024, 6, 15));

        assertThat(slots).hasSize(15);
        assertThat(slots).doesNotContain("10:00");
    }

    @Test
    void getAvailableSlots_throwsEntityNotFoundException_whenBranchNotFound() {
        when(branchRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.getAvailableSlots(99L, LocalDate.of(2024, 6, 15)))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    private AppointmentRequest buildRequest() {
        AppointmentRequest req = new AppointmentRequest();
        req.setTopicId(1L);
        req.setBranchId(1L);
        req.setDate(LocalDate.of(2024, 6, 15));
        req.setTime("10:00");
        req.setFirstName("John");
        req.setLastName("Smith");
        req.setEmail("john.smith@example.com");
        req.setPhone("555-1234");
        return req;
    }
}
