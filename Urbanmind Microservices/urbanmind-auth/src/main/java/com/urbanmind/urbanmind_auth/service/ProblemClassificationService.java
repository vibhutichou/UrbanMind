package com.urbanmind.urbanmind_auth.service;

import com.urbanmind.urbanmind_auth.entity.ProblemClassification;

public interface ProblemClassificationService {

    ProblemClassification getClassification(Long problemId);

    ProblemClassification manualOverride(Long problemId, String severity, String category);
}
