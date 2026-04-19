package com.team10.appointments.controller;

import com.team10.appointments.model.Branch;
import com.team10.appointments.service.BranchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService service;

    public BranchController(BranchService service) {
        this.service = service;
    }

    // GET /api/branches            → all branches
    // GET /api/branches?topicId=X  → branches that support the given topic
    @GetMapping
    public List<Branch> getAll(@RequestParam(required = false) Long topicId) {
        if (topicId != null) return service.getByTopicId(topicId);
        return service.getAll();
    }
}
