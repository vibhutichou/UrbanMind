package com.urbanmind.urbanmind_auth.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.urbanmind.urbanmind_auth.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtp(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("YOUR_GMAIL@gmail.com");
        message.setTo(email);
        message.setSubject("UrbanMind Password Reset OTP");
        message.setText(
            "Your OTP is: " + otp + "\n\n" +
            "This OTP is valid for 5 minutes.\n" +
            "Do not share this with anyone."
        );

        mailSender.send(message);
    }
}


