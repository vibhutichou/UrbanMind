//package com.urbanmind.urbanmind_auth.service.impl;
//
//import java.time.OffsetDateTime;
//import java.util.Random;
//
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import com.urbanmind.urbanmind_auth.entity.PasswordResetToken;
//import com.urbanmind.urbanmind_auth.entity.User;
//import com.urbanmind.urbanmind_auth.repository.UserRepository;
//
//@Service
//public class ForgotPasswordService {
//
//    private final UserRepository userRepo;
//    private final PasswordResetTokenRepository tokenRepo;
//    private final PasswordEncoder passwordEncoder;
//    private final EmailService emailService;
//
//    public ForgotPasswordService(
//            UserRepository userRepo,
//            PasswordResetTokenRepository tokenRepo,
//            PasswordEncoder passwordEncoder,
//            EmailService emailService
//    ) {
//        this.userRepo = userRepo;
//        this.tokenRepo = tokenRepo;
//        this.passwordEncoder = passwordEncoder;
//        this.emailService = emailService;
//    }
//
//    public void sendOtp(String email) {
//
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Email not registered"));
//
//        String otp = String.valueOf(100000 + new Random().nextInt(900000));
//
//        PasswordResetToken token = new PasswordResetToken();
//        token.setUser(user);
//        token.setOtpHash(passwordEncoder.encode(otp));
//        token.setExpiresAt(OffsetDateTime.now().plusMinutes(10));
//        token.setCreatedAt(OffsetDateTime.now());
//
//        tokenRepo.save(token);
//
//        emailService.sendEmail(
//                email,
//                "Password Reset OTP",
//                "Your OTP is: " + otp + "\nValid for 10 minutes."
//        );
//    }
//}
