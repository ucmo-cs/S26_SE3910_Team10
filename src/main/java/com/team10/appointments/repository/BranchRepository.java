package com.team10.appointments.repository;

import com.team10.appointments.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByTopicsId(Long topicId);
}
