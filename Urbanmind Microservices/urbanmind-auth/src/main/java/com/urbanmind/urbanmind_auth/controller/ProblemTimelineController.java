package com.urbanmind.urbanmind_auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.urbanmind.urbanmind_auth.entity.ProblemTimeline;
import com.urbanmind.urbanmind_auth.service.ProblemTimelineService;

@RestController
@RequestMapping("/api/problems")

public class ProblemTimelineController {

    private final ProblemTimelineService timelineService;

    public ProblemTimelineController(ProblemTimelineService timelineService) {
        this.timelineService = timelineService;
    }

    @GetMapping("/{problemId}/timeline")
    public ResponseEntity<List<ProblemTimeline>> getTimeline(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                timelineService.getTimeline(problemId)
        );
    }
}
