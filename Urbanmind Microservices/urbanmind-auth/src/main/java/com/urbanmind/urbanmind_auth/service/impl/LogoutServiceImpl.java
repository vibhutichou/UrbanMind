package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.urbanmind.urbanmind_auth.config.JwtTokenProvider;
import com.urbanmind.urbanmind_auth.entity.RevokedToken;
import com.urbanmind.urbanmind_auth.repository.RevokedTokenRepository;
import com.urbanmind.urbanmind_auth.service.LogoutService;

@Service
public class LogoutServiceImpl implements LogoutService {

    private final RevokedTokenRepository revokedTokenRepository;
    private final JwtTokenProvider tokenProvider;

    public LogoutServiceImpl(
            RevokedTokenRepository revokedTokenRepository,
            JwtTokenProvider tokenProvider
    ) {
        this.revokedTokenRepository = revokedTokenRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void logout(String token) {

        Date expiryDate = tokenProvider.getExpiry(token);

        OffsetDateTime expiry = OffsetDateTime.ofInstant(
                expiryDate.toInstant(),
                ZoneOffset.UTC
        );

        revokedTokenRepository.save(new RevokedToken(token, expiry));
    }
}
