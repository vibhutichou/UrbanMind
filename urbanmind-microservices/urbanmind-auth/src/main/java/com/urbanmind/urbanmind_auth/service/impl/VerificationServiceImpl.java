package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.urbanmind.urbanmind_auth.dto.request.VerificationCreateRequest;
import com.urbanmind.urbanmind_auth.dto.request.VerificationStatusRequest;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.entity.VerificationRequest;
import com.urbanmind.urbanmind_auth.exception.ApiException;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.repository.VerificationRequestRepository;
import com.urbanmind.urbanmind_auth.service.VerificationService;

@Service
public class VerificationServiceImpl implements VerificationService {

    private final VerificationRequestRepository vrRepo;
    private final UserRepository userRepo;

    public VerificationServiceImpl(
            VerificationRequestRepository vrRepo,
            UserRepository userRepo
    ) {
        this.vrRepo = vrRepo;
        this.userRepo = userRepo;
    }

    // ✅ NGO / User submits verification
    @Override
    public void createVerificationRequest(String email, VerificationCreateRequest req, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        // CHANGE: Check for existing pending request to prevent duplicates
        VerificationRequest existing = vrRepo.findTopByUserEmailOrderByCreatedAtDesc(email).orElse(null);
        if (existing != null && "PENDING".equals(existing.getStatus())) {
            throw new ApiException("You already have a pending verification request. Please wait for admin review.");
        }

        VerificationRequest vr = new VerificationRequest();
        vr.setUser(user);
        vr.setCurrRole(user.getPrimaryRole());
        // CHANGE: Use dynamic requestedRole from DTO instead of hardcoded "NGO"
        vr.setRequestedRole(req.getRequestedRole() != null ? req.getRequestedRole() : "NGO");  // Fallback to "NGO" if null
        vr.setStatus("PENDING");
        
        // Handle File Upload
        if (file != null && !file.isEmpty()) {
            try {
                // Ensure upload directory exists
                java.nio.file.Files.createDirectories(java.nio.file.Paths.get("uploads"));
                
                // Save file
                String filename = java.util.UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "");
                java.nio.file.Path path = java.nio.file.Paths.get("uploads", filename);
                java.nio.file.Files.copy(file.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                vr.setDocumentUrl("/uploads/" + filename);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store verification document", e);
            }
        } else if (req.getDocumentUrl() != null) {
            vr.setDocumentUrl(req.getDocumentUrl()); 
        }
        
        vr.setNotes(req.getNotes());
        
        vr.setCreatedAt(OffsetDateTime.now());
        vr.setUpdatedAt(OffsetDateTime.now());

        vrRepo.save(vr);
    }

    // ✅ NGO sees own verification
    @Override
    public VerificationRequest getMyVerification(String email) {
        return vrRepo
                .findTopByUserEmailOrderByCreatedAtDesc(email)
                .orElse(null);
    }

    // ✅ ADMIN approves / rejects
    @Override
    public void updateStatus(Long id, VerificationStatusRequest req) {
        VerificationRequest vr = vrRepo.findById(id)
                .orElseThrow(() -> new ApiException("Request not found"));

        String status = req.getStatus().toUpperCase();
        // CHANGE: Simplify check to only "APPROVED" and "REJECTED" (remove "VERIFIED" to avoid confusion)
        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            throw new ApiException("Invalid status. Must be APPROVED or REJECTED.");
        }

        // CHANGE: Set status to "VERIFIED" if approved, "REJECTED" if rejected (for frontend consistency)
        vr.setStatus(status.equals("APPROVED") ? "VERIFIED" : "REJECTED");
        vr.setAdminComment(req.getAdminComment());
        vr.setReviewedAt(OffsetDateTime.now());
        vr.setUpdatedAt(OffsetDateTime.now());

        if (status.equals("APPROVED")) {
            User user = vr.getUser();
            // CHANGE: Update primaryRole to the requested role
            user.setPrimaryRole(vr.getRequestedRole());
            // CHANGE: Set kycStatus if User entity has it (for additional tracking)
            if (user.getKycStatus() != null) {  // Check if field exists
                user.setKycStatus("VERIFIED");
            }
            userRepo.save(user);
        } else if (status.equals("REJECTED")) {
            // CHANGE: Optionally set kycStatus to "REJECTED" if approved above
            User user = vr.getUser();
            if (user.getKycStatus() != null) {
                user.setKycStatus("REJECTED");
            }
            userRepo.save(user);
        }

        vrRepo.save(vr);
    }
}