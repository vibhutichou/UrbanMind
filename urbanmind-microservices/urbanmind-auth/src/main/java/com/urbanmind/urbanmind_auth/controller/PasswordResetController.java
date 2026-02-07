package com.urbanmind.urbanmind_auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.dto.request.ForgotPasswordRequest;
import com.urbanmind.urbanmind_auth.dto.request.ResetPasswordRequest;
import com.urbanmind.urbanmind_auth.service.impl.PasswordResetService;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService resetService;

    public PasswordResetController(PasswordResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        resetService.sendOtp(req.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest req) {
        resetService.resetPassword(
                req.getEmail(),
                req.getOtp(),
                req.getNewPassword()
        );
        return ResponseEntity.ok().build();
    }
}
