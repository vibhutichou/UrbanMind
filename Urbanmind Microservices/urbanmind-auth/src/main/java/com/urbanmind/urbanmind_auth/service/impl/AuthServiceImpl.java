package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.urbanmind.urbanmind_auth.config.JwtTokenProvider;
import com.urbanmind.urbanmind_auth.dto.request.LoginRequest;
import com.urbanmind.urbanmind_auth.dto.request.RegisterRequest;
import com.urbanmind.urbanmind_auth.dto.response.AuthResponse;
import com.urbanmind.urbanmind_auth.dto.response.RegisterResponse;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.exception.ApiException;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered");
        }

        String role = request.getRole().toUpperCase();

        User user = new User();
        user.setUsername(request.getEmail()); // important, explained below
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPrimaryRole(role);
        user.setStatus("ACTIVE");
        OffsetDateTime now = OffsetDateTime.now();

        user.setCreatedAt(now);
        user.setUpdatedAt(now);


        userRepository.save(user);

        return new RegisterResponse(user.getId(), user.getPrimaryRole());
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        long expirySeconds = request.isRememberMe()
                ? 7 * 24 * 60 * 60      // 7 days
                : 30 * 60;              // 30 minutes

        String token = tokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getPrimaryRole(),
                user.getStatus(),
                expirySeconds
        );

        return new AuthResponse(token);
    }


}
