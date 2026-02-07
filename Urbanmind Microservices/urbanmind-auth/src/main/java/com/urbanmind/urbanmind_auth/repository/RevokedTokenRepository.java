package com.urbanmind.urbanmind_auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urbanmind.urbanmind_auth.entity.RevokedToken;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);
}
