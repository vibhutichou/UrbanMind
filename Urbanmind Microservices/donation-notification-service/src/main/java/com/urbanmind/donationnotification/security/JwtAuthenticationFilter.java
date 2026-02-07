package com.urbanmind.donationnotification.security;


import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final com.urbanmind.donationnotification.repository.RevokedTokenRepository revokedTokenRepository;

    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            com.urbanmind.donationnotification.repository.RevokedTokenRepository revokedTokenRepository) {
        this.tokenProvider = tokenProvider;
        this.revokedTokenRepository = revokedTokenRepository;
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        return path.startsWith("/ws")
            || path.startsWith("/ws/")
            || path.startsWith("/websocket")
            || path.contains("/sockjs");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 1. Check for Bearer Token
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // 2. BLACKLIST CHECK: Reject if token is in database
            if (revokedTokenRepository.existsByToken(token)) {
                // Return 401 Unauthorized immediately
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token is revoked/blacklisted");
                return;
            }

            // 3. Validate Token (Signature Check)
            if (tokenProvider.validateToken(token)) {

                // 4. Extract User Details directly from Token (No DB call)
                String email = tokenProvider.getEmail(token);
                String role = tokenProvider.getPrimaryRole(token); // e.g., "ADMIN", "CITIZEN"

                // 5. Create Authority (Add "ROLE_" prefix for Spring Security)
                List<SimpleGrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority("ROLE_" + role));

                // 6. Create Authentication Object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null, // No password needed here
                                authorities
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7. Set Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
