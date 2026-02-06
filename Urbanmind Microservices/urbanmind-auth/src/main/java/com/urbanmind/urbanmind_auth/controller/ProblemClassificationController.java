package com.urbanmind.urbanmind_auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.entity.ProblemClassification;
import com.urbanmind.urbanmind_auth.service.ProblemClassificationService;

//REST controller for problem classification (fetch and manual override)
@RestController
@RequestMapping("/api")


public class ProblemClassificationController {

    private final ProblemClassificationService classificationService;

    // Inject ProblemClassificationService via constructor
    public ProblemClassificationController(
            ProblemClassificationService classificationService) {
        this.classificationService = classificationService;
    }

    // GET: return computed classification for a problem
    // GET http://localhost:7000/api/problems/{problemId}/classification
    @GetMapping("/problems/{problemId}/classification")
    public ResponseEntity<ProblemClassification> getClassification(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                classificationService.getClassification(problemId)
        );
    }

    // PUT: manually override severity and category for a problem
    // PUT http://localhost:7000/api/problems/{problemId}/classification?manualSeverity=X&manualCategory=Y
    @PutMapping("/problems/{problemId}/classification")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('VOLUNTEER') or hasRole('ADMIN')")
    public ResponseEntity<ProblemClassification> manualOverride(
            @PathVariable Long problemId,
            @RequestParam String manualSeverity,
            @RequestParam String manualCategory) {

        return ResponseEntity.ok(
                classificationService.manualOverride(
                        problemId, manualSeverity, manualCategory)
        );
    }
}