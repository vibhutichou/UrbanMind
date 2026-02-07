package cdac.project.urbanmind.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cdac.project.urbanmind.entity.RevokedTokenEntity;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedTokenEntity, Long> {
    Optional<RevokedTokenEntity> findByToken(String token);
    boolean existsByToken(String token);
}