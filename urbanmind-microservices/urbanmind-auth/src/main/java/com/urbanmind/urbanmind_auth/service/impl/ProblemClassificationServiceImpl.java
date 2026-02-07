package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.entity.ProblemClassification;
import com.urbanmind.urbanmind_auth.exception.ResourceNotFoundException;
import com.urbanmind.urbanmind_auth.repository.ProblemClassificationRepository;
import com.urbanmind.urbanmind_auth.service.ProblemClassificationService;

@Service
@Transactional
public class ProblemClassificationServiceImpl
        implements ProblemClassificationService {

    private final ProblemClassificationRepository repository;

    public ProblemClassificationServiceImpl(
            ProblemClassificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProblemClassification getClassification(Long problemId) {
        return repository.findByProblemId(problemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classification not found"));
    }

    @Override
    public ProblemClassification manualOverride(
            Long problemId,
            String severity,
            String category) {

        ProblemClassification pc = getClassification(problemId);
        pc.setManualSeverity(severity);
        pc.setManualCategory(category);
        pc.setIsManualOverride(true);
        pc.setUpdatedAt(OffsetDateTime.now());

        return repository.save(pc);
    }
}
