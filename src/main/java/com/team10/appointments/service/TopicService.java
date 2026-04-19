package com.team10.appointments.service;

import com.team10.appointments.model.Topic;
import com.team10.appointments.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    private final TopicRepository repository;

    public TopicService(TopicRepository repository) {
        this.repository = repository;
    }

    public List<Topic> getAll() {
        return repository.findAll();
    }
}
