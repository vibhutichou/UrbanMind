package org.urbanmind.UrbanChats.Repository;




import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.urbanmind.UrbanChats.Entity.RevokedTokenEntity;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedTokenEntity, Long> {
    Optional<RevokedTokenEntity> findByToken(String token);
    boolean existsByToken(String token);
}