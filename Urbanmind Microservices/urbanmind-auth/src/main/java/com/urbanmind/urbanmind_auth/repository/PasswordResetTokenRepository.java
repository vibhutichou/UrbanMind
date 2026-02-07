package com.urbanmind.urbanmind_auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.urbanmind.urbanmind_auth.entity.PasswordResetToken;
import com.urbanmind.urbanmind_auth.entity.User;

import jakarta.transaction.Transactional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findTopByUserAndUsedFalseOrderByCreatedAtDesc(User user);
    @Transactional
    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true WHERE t.user = :user AND t.used = false")
    void deleteAllByUserAndUsedFalse(User user);
   
   
}


