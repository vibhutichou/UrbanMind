package com.urbanmind.urbanmind_auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.Problem;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    // For admin: view all reported problems
    List<Problem> findAllByOrderByCreatedAtDesc();

    // For user: view own reported problems
    List<Problem> findByCreatedByUserIdOrderByCreatedAtDesc(Long userId);

    // For admin filtering (OPEN, IN_PROGRESS, RESOLVED, etc.)
    List<Problem> findByStatusOrderByCreatedAtDesc(String status);

    // For volunteer: view assigned problems
    List<Problem> findByAssignedToUserIdOrderByCreatedAtDesc(Long userId);
}
