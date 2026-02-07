package cdac.project.urbanmind.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cdac.project.urbanmind.entity.VolunteerProfileEntity;

public interface VolunteerProfileRepository
        extends JpaRepository<VolunteerProfileEntity, Long> {

    Optional<VolunteerProfileEntity> findByUserId(Long userId);
}
