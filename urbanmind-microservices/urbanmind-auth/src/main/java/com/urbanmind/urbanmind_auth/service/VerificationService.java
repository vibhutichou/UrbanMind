package com.urbanmind.urbanmind_auth.service;

import com.urbanmind.urbanmind_auth.dto.request.VerificationCreateRequest;
import com.urbanmind.urbanmind_auth.dto.request.VerificationStatusRequest;
import com.urbanmind.urbanmind_auth.entity.VerificationRequest;

import org.springframework.web.multipart.MultipartFile;

public interface VerificationService {

    // NGO / User
    void createVerificationRequest(String email, VerificationCreateRequest req, MultipartFile file);

    VerificationRequest getMyVerification(String email);

    // Admin
    void updateStatus(Long id, VerificationStatusRequest req);
}
