package cdac.project.urbanmind.security;


import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
@Component
public class JwtTokenProvider {
    private final SecretKey secretKey;
    // We only need the secret to VALIDATE in other services
    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // Log error if needed
            return false;
        }
    }
    public String getEmail(String token) {
        return parseClaims(token).getSubject();
    }
    public Long getUserId(String token) {
        return parseClaims(token).get("userId", Long.class);
    }
    public String getPrimaryRole(String token) {
        return parseClaims(token).get("primaryRole", String.class);
    }
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}