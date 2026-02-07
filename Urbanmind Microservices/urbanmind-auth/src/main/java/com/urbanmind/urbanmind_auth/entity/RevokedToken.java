package com.urbanmind.urbanmind_auth.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "revoked_tokens", schema = "urbanmind")
public class RevokedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String token;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "revoked_at", nullable = false)
    private OffsetDateTime revokedAt;

    public RevokedToken() {
    }

    public RevokedToken(String token, OffsetDateTime expiresAt) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.revokedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public String getToken() { return token; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public OffsetDateTime getRevokedAt() { return revokedAt; }
}
