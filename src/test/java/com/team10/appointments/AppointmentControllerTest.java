package com.team10.appointments;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team10.appointments.controller.AppointmentController;
import com.team10.appointments.dto.AppointmentRequest;
import com.team10.appointments.model.Appointment;
import com.team10.appointments.model.AppointmentStatus;
import com.team10.appointments.model.Branch;
import com.team10.appointments.model.Topic;
import com.team10.appointments.service.AppointmentService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppointmentController.class)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AppointmentService service;

    private Appointment sampleAppointment;

    @BeforeEach
    void setUp() {
        Topic topic = new Topic();
        topic.setName("Loan Consultation");

        Branch branch = new Branch();
        branch.setName("Downtown Branch");
        branch.setAddress("123 Main St");

        sampleAppointment = new Appointment();
        sampleAppointment.setTopic(topic);
        sampleAppointment.setBranch(branch);
        sampleAppointment.setDate(LocalDate.of(2024, 6, 15));
        sampleAppointment.setTime("10:00");
        sampleAppointment.setFirstName("John");
        sampleAppointment.setLastName("Smith");
        sampleAppointment.setEmail("john.smith@example.com");
        sampleAppointment.setPhone("555-1234");
    }

    @Test
    void getAll_returns200WithAppointmentList() throws Exception {
        when(service.getAll()).thenReturn(List.of(sampleAppointment));

        mockMvc.perform(get("/api/appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].topic.name").value("Loan Consultation"));
    }

    @Test
    void getById_returns200_whenFound() throws Exception {
        when(service.getById(1L)).thenReturn(sampleAppointment);

        mockMvc.perform(get("/api/appointments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.smith@example.com"));
    }

    @Test
    void getById_returns404_whenNotFound() throws Exception {
        when(service.getById(99L)).thenThrow(new EntityNotFoundException("Appointment not found: 99"));

        mockMvc.perform(get("/api/appointments/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_returns201_withSavedAppointment() throws Exception {
        AppointmentRequest req = buildRequest();
        when(service.create(any(AppointmentRequest.class))).thenReturn(sampleAppointment);

        mockMvc.perform(post("/api/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void create_returns400_whenRequiredFieldsMissing() throws Exception {
        mockMvc.perform(post("/api/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cancel_returns200_withUpdatedAppointment() throws Exception {
        sampleAppointment.setStatus(AppointmentStatus.CANCELLED);
        when(service.cancel(1L)).thenReturn(sampleAppointment);

        mockMvc.perform(patch("/api/appointments/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void cancel_returns404_whenNotFound() throws Exception {
        when(service.cancel(99L)).thenThrow(new EntityNotFoundException("Appointment not found: 99"));

        mockMvc.perform(patch("/api/appointments/99/cancel"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_returns204_whenSuccessful() throws Exception {
        mockMvc.perform(delete("/api/appointments/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_returns404_whenNotFound() throws Exception {
        doThrow(new EntityNotFoundException("Appointment not found: 99"))
                .when(service).delete(99L);

        mockMvc.perform(delete("/api/appointments/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAvailableSlots_returns200_withSlotList() throws Exception {
        when(service.getAvailableSlots(eq(1L), any(LocalDate.class)))
                .thenReturn(List.of("09:00", "09:30", "10:00"));

        mockMvc.perform(get("/api/appointments/available-slots")
                        .param("branchId", "1")
                        .param("date", "2024-06-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("09:00"))
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void getAvailableSlots_returns404_whenBranchNotFound() throws Exception {
        when(service.getAvailableSlots(eq(99L), any(LocalDate.class)))
                .thenThrow(new EntityNotFoundException("Branch not found: 99"));

        mockMvc.perform(get("/api/appointments/available-slots")
                        .param("branchId", "99")
                        .param("date", "2024-06-15"))
                .andExpect(status().isNotFound());
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
