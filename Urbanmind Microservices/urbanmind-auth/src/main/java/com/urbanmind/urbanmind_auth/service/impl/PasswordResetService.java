package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.entity.PasswordResetToken;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.exception.ApiException;
import com.urbanmind.urbanmind_auth.repository.PasswordResetTokenRepository;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.EmailService;

@Service
public class PasswordResetService {

    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(
            UserRepository userRepo,
            PasswordResetTokenRepository tokenRepo,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void sendOtp(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("Email not registered"));
        Optional<PasswordResetToken> lastToken =
        	    tokenRepo.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user);

        	if (lastToken.isPresent()) {
        	    OffsetDateTime lastTime = lastToken.get().getCreatedAt();
        	    if (lastTime.plusSeconds(60).isAfter(OffsetDateTime.now())) {
        	        throw new ApiException("Please wait 60 seconds before requesting a new OTP");
        	    }
        	}

        // 🔐 Delete previous unused OTPs
        tokenRepo.deleteAllByUserAndUsedFalse(user);

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setOtpHash(passwordEncoder.encode(otp));
        token.setExpiresAt(OffsetDateTime.now().plusMinutes(5));
        token.setCreatedAt(OffsetDateTime.now());
        token.setUsed(false);

        tokenRepo.save(token);

        emailService.sendOtp(email, otp);
    }



    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        PasswordResetToken token = tokenRepo
                .findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new ApiException("OTP not found"));
        if (newPassword.length() < 6) {
            throw new ApiException("Password must be at least 6 characters long");
        }

        if (token.isUsed()) {
            throw new ApiException("OTP already used");
        }

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new ApiException("OTP expired");
        }

        if (!passwordEncoder.matches(otp, token.getOtpHash())) {
            throw new ApiException("Invalid OTP");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(OffsetDateTime.now());
        userRepo.save(user);

        token.setUsed(true);
        tokenRepo.save(token);
    }

}
