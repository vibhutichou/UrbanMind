package com.urbanmind.urbanmind_auth.config;
//
//
//import io.jsonwebtoken.JwtException;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//
//@Component
//public class JwtTokenProvider {
//
//    private final SecretKey secretKey;
//    private final long expiration;
//
//    public JwtTokenProvider(
//            @Value("${jwt.secret}") String secret,
//            @Value("${jwt.access-token-expiration}") long expiration
//    ) {
//        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
//        this.expiration = expiration;
//    }
//
//    public String generateToken(String email, String role) {
//        return Jwts.builder()
//                .subject(email)
//                .claim("role", role)
//                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + expiration))
//                .signWith(secretKey)
//                .compact();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser()
//                .verifyWith(secretKey)
//                .build()
//                .parseSignedClaims(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    public String getEmail(String token) {
//        return Jwts.parser()
//                .verifyWith(secretKey)
//                .build()
//                .parseSignedClaims(token)
//                .getPayload()
//                .getSubject();
//    }
//
//    public String getRole(String token) {
//        return Jwts.parser()
//                .verifyWith(secretKey)
//                .build()
//                .parseSignedClaims(token)
//                .getPayload()
//                .get("role", String.class);
//    }
//}package com.urbanmind.urbanmind_auth.config;



import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
   
    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long expirationMillis
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        
    }

    public String generateToken(Long userId, String email, String primaryRole, String status,long expirySeconds) {
    	Date now = new Date();
        Date expiry = new Date(now.getTime() + expirySeconds * 1000);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("primaryRole", primaryRole);
        claims.put("status", status);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(expiry)
                //.expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
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

    public String getStatus(String token) {
        return parseClaims(token).get("status", String.class);
    }

    public Date getExpiry(String token) {
        return parseClaims(token).getExpiration();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

