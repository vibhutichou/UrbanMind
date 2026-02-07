package com.urbanmind.urbanmind_auth.service;


public interface EmailService {
    void sendOtp(String email, String otp);
}
