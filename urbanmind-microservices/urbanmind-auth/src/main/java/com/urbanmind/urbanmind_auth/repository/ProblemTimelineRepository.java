package com.urbanmind.urbanmind_auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.ProblemTimeline;

public interface ProblemTimelineRepository extends JpaRepository<ProblemTimeline, Long> {

    List<ProblemTimeline> findByProblemIdOrderByCreatedAtAsc(Long problemId);
}
