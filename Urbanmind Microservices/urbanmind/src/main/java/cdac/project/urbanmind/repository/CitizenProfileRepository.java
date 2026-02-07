package cdac.project.urbanmind.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cdac.project.urbanmind.entity.CitizenProfileEntity;

public interface CitizenProfileRepository
        extends JpaRepository<CitizenProfileEntity, Long> {

    Optional<CitizenProfileEntity> findByUserId(Long userId);
}
