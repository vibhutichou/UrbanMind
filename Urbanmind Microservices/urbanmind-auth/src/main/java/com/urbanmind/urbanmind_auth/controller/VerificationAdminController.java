package com.urbanmind.urbanmind_auth.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.dto.request.VerificationStatusRequest;
import com.urbanmind.urbanmind_auth.repository.VerificationRequestRepository;
import com.urbanmind.urbanmind_auth.service.VerificationService;
@RestController
@RequestMapping("/verification-requests")
public class VerificationAdminController {

    private final VerificationRequestRepository vrRepo;
    private final VerificationService verificationService;

    public VerificationAdminController(
            VerificationRequestRepository vrRepo,
            VerificationService verificationService
    ) {
        this.vrRepo = vrRepo;
        this.verificationService = verificationService;
    }

    // Admin sees pending requests
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String status
    ) {
        if (status != null) {
            return ResponseEntity.ok(vrRepo.findByStatus(status));
        }
        return ResponseEntity.ok(vrRepo.findAll());
    }

    // Admin approves/rejects
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody VerificationStatusRequest req
    ) {
        verificationService.updateStatus(id, req);
        return ResponseEntity.ok().build();
    }
}
