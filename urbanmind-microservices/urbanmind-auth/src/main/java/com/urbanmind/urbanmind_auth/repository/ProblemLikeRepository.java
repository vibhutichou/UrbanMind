package com.urbanmind.urbanmind_auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.urbanmind.urbanmind_auth.entity.ProblemLike;

public interface ProblemLikeRepository extends JpaRepository<ProblemLike, Long> {
    Boolean existsByProblemIdAndUserId(Long problemId, Long userId);
    void deleteByProblemIdAndUserId(Long problemId, Long userId);
    
}
