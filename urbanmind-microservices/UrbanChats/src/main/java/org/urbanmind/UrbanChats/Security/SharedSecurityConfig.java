package org.urbanmind.UrbanChats.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize
public class SharedSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SharedSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔹 Disable CSRF (JWT based API)
            .csrf(csrf -> csrf.disable())

            // 🔹 Enable CORS (CRITICAL for React)
            .cors(cors -> {})

            // 🔹 Stateless session (JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // 🔹 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // ✅ Allow browser preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ Public auth endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/error").permitAll()  
                .requestMatchers("/ws/**").permitAll()
                // ✅ Existing allowed endpoints
                .requestMatchers("/UrbanChats/api/v1/**").authenticated()
                .requestMatchers("/api/v1/**").authenticated()
                .requestMatchers("/chats/**").authenticated()

                // 🔒 Everything else requires JWT
                .anyRequest().authenticated()
            )

            
      // 🔹 JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
