package com.urbanmind.urbanmind_auth.service;
import java.util.List;

import com.urbanmind.urbanmind_auth.entity.ProblemMedia;

// Service for adding and fetching media attached to problems
public interface ProblemMediaService {
    // Add media (image/file) to a problem
    ProblemMedia addMedia(Long problemId, org.springframework.web.multipart.MultipartFile file, Long userId);
    // List media for a given problem
    List<ProblemMedia> getMediaByProblem(Long problemId);
}