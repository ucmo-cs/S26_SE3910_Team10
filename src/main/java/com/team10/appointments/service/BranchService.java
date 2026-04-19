package com.team10.appointments.service;

import com.team10.appointments.model.Branch;
import com.team10.appointments.repository.BranchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchService {

    private final BranchRepository repository;

    public BranchService(BranchRepository repository) {
        this.repository = repository;
    }

    public List<Branch> getAll() {
        return repository.findAll();
    }

    public List<Branch> getByTopicId(Long topicId) {
        return repository.findByTopicsId(topicId);
    }
}
