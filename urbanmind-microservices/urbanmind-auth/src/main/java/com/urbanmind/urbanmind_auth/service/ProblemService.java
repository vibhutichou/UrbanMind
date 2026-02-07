package com.urbanmind.urbanmind_auth.service;

import java.util.List;
import com.urbanmind.urbanmind_auth.dto.request.ProblemRequestDTO;
import com.urbanmind.urbanmind_auth.dto.request.StatusUpdateDTO;
import com.urbanmind.urbanmind_auth.entity.Problem;

public interface ProblemService {

    Problem createProblem(ProblemRequestDTO dto, Long userId);

    Problem updateStatus(Long problemId, StatusUpdateDTO dto);

    List<Problem> getAllProblems();

    List<Problem> getProblemsByUser(Long userId);

    void likeProblem(Long problemId, Long userId);

    void unlikeProblem(Long problemId, Long userId);

    void shareProblem(Long problemId);

    Problem assignProblem(Long problemId, Long volunteerId);
    
    Problem resolveProblem(Long problemId, Long volunteerId);
    
    List<Problem> getAssignedProblems(Long volunteerId);

    Problem updateProblem(Long problemId, ProblemRequestDTO dto);
}