package com.urbanmind.urbanmind_auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.dto.request.LoginRequest;
import com.urbanmind.urbanmind_auth.dto.request.RegisterRequest;
import com.urbanmind.urbanmind_auth.dto.response.AuthResponse;
import com.urbanmind.urbanmind_auth.dto.response.RegisterResponse;
import com.urbanmind.urbanmind_auth.service.AuthService;
import com.urbanmind.urbanmind_auth.service.LogoutService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private final LogoutService logoutService;

    private final AuthService authService;

    public AuthController(AuthService authService,LogoutService logoutService) {
        this.authService = authService;
        this.logoutService = logoutService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        // ✅ REMOVE "Bearer "
        String token = header.substring(7);

        logoutService.logout(token);

        return ResponseEntity.ok().build();
    }


}
