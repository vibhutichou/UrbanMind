package com.urbanmind.urbanmind_auth.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.VerificationRequest;

public interface VerificationRequestRepository
        extends JpaRepository<VerificationRequest, Long> {

    Optional<VerificationRequest>
    findTopByUserEmailOrderByCreatedAtDesc(String email);

    List<VerificationRequest> findByStatus(String status);
}
