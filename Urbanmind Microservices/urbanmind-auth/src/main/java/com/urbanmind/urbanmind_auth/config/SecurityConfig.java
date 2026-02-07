package com.urbanmind.urbanmind_auth.config;

//import java.util.Arrays;
//
//import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

           
            //.cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ❌ REMOVE formLogin completely
            .formLogin(form -> form.disable())

            // ❌ REMOVE httpBasic
            .httpBasic(basic -> basic.disable())

            // ✅ Handle unauthorized properly (NO REDIRECT)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex1) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                })
            )
            .authorizeHttpRequests(auth -> auth
            		// ✅ VERY IMPORTANT FOR CORS PREFLIGHT
            		.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
            		
            	    .requestMatchers("/auth/**","/uploads/**").permitAll()

            	    .requestMatchers("/verification/**")
            	        .hasAnyAuthority("ROLE_CITIZEN", "ROLE_NGO", "ROLE_VOLUNTEER")

            	    .requestMatchers("/verification-requests/**")
            	        .hasAuthority("ROLE_ADMIN")

            	    .anyRequest().authenticated()
            	)


            // ✅ VERY IMPORTANT
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
    
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        // Allow your React app's origin
//        configuration.setAllowedOrigins(List.of("http://localhost:3000")); 
//        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
//        configuration.setAllowCredentials(false);
//        configuration.setMaxAge(3600L);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }

}
