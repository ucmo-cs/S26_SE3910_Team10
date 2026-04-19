package com.team10.appointments.controller;

import com.team10.appointments.model.Topic;
import com.team10.appointments.service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @GetMapping
    public List<Topic> getAll() {
        return service.getAll();
    }
}
