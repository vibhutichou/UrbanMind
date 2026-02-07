package com.urbanmind.urbanmind_auth.service;

import java.util.List;
import com.urbanmind.urbanmind_auth.entity.ProblemTimeline;

public interface ProblemTimelineService {

    void addTimeline(
        Long problemId,
        String fromStatus,
        String toStatus,
        String note,
        Long userId
    );

    List<ProblemTimeline> getTimeline(Long problemId);
}
