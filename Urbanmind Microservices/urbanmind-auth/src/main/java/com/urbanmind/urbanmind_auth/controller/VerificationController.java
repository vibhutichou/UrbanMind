package com.urbanmind.urbanmind_auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.urbanmind.urbanmind_auth.dto.request.VerificationCreateRequest;
import com.urbanmind.urbanmind_auth.entity.VerificationRequest;
import com.urbanmind.urbanmind_auth.service.VerificationService;

@RestController
@RequestMapping("/verification")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    // NGO submits verification
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Void> submit(
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam("notes") String notes,
            @RequestParam(value = "requestedRole", defaultValue = "NGO") String requestedRole) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        VerificationCreateRequest req = new VerificationCreateRequest();
        req.setNotes(notes);
        req.setRequestedRole(requestedRole);

        verificationService.createVerificationRequest(email, req, file);
        return ResponseEntity.ok().build();
    }

    // NGO sees own verification
    @GetMapping("/me")
    public ResponseEntity<VerificationRequest> myVerification() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        VerificationRequest vr = verificationService.getMyVerification(email);
        
        if (vr == null) {
            // Return an empty object or a specific status so the frontend knows to stay "Unverified"
            return ResponseEntity.noContent().build(); 
        }
        return ResponseEntity.ok(vr);
    }
}
