package com.urbanmind.urbanmind_auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.ProblemMedia;

public interface ProblemMediaRepository extends JpaRepository<ProblemMedia, Long> {

    List<ProblemMedia> findByProblemIdOrderByCreatedAtAsc(Long problemId);
}
