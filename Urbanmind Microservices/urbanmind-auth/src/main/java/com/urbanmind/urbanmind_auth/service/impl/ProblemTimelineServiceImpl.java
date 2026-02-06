package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.entity.ProblemTimeline;
import com.urbanmind.urbanmind_auth.repository.ProblemTimelineRepository;
import com.urbanmind.urbanmind_auth.service.ProblemTimelineService;

@Service
@Transactional
public class ProblemTimelineServiceImpl implements ProblemTimelineService {

    private final ProblemTimelineRepository timelineRepository;

    public ProblemTimelineServiceImpl(ProblemTimelineRepository timelineRepository) {
        this.timelineRepository = timelineRepository;
    }

    @Override
    public void addTimeline(Long problemId,
                            String fromStatus,
                            String toStatus,
                            String note,
                            Long userId) {

        ProblemTimeline timeline = new ProblemTimeline();
        timeline.setProblemId(problemId);
        timeline.setFromStatus(fromStatus);
        timeline.setToStatus(toStatus);
        timeline.setNote(note);
        timeline.setChangedByUserId(userId);
        timeline.setCreatedAt(OffsetDateTime.now());

        timelineRepository.save(timeline);
    }

    @Override
    public List<ProblemTimeline> getTimeline(Long problemId) {
        return timelineRepository.findByProblemIdOrderByCreatedAtAsc(problemId);
    }
}
