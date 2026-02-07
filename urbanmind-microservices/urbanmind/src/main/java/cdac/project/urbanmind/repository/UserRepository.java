package cdac.project.urbanmind.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cdac.project.urbanmind.entity.UserEntity;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    List<UserEntity> findByPrimaryRole(String primaryRole);
}
