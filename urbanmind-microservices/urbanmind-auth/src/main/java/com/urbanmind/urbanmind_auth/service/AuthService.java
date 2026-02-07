package com.urbanmind.urbanmind_auth.service;

import com.urbanmind.urbanmind_auth.dto.request.LoginRequest;
import com.urbanmind.urbanmind_auth.dto.request.RegisterRequest;
import com.urbanmind.urbanmind_auth.dto.response.AuthResponse;
import com.urbanmind.urbanmind_auth.dto.response.RegisterResponse;

public interface AuthService {

	RegisterResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
