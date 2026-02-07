package com.urbanmind.urbanmind_auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.ProblemClassification;

public interface ProblemClassificationRepository
        extends JpaRepository<ProblemClassification, Long> {

    Optional<ProblemClassification> findByProblemId(Long problemId);
}
