package cdac.project.urbanmind.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cdac.project.urbanmind.entity.NgoProfileEntity;

public interface NgoProfileRepository
        extends JpaRepository<NgoProfileEntity, Long> {

    Optional<NgoProfileEntity> findByUserId(Long userId);
}
