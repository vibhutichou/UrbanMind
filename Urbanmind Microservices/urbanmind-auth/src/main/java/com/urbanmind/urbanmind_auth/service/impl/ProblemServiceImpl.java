package com.urbanmind.urbanmind_auth.service.impl;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.dto.request.ProblemRequestDTO;
import com.urbanmind.urbanmind_auth.dto.request.StatusUpdateDTO;
import com.urbanmind.urbanmind_auth.entity.Problem;
import com.urbanmind.urbanmind_auth.entity.ProblemLike;
import com.urbanmind.urbanmind_auth.repository.ProblemLikeRepository;
import com.urbanmind.urbanmind_auth.repository.ProblemRepository;
import com.urbanmind.urbanmind_auth.service.ProblemService;
import com.urbanmind.urbanmind_auth.service.ProblemTimelineService;

@Service
@Transactional
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemTimelineService timelineService;
    private final ProblemLikeRepository likeRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository,
                              ProblemTimelineService timelineService,
                              ProblemLikeRepository likeRepository) {
        this.problemRepository = problemRepository;
        this.timelineService = timelineService;
        this.likeRepository = likeRepository;
    }

    @Override
    public Problem createProblem(ProblemRequestDTO dto, Long userId) {

        Problem p = new Problem();

        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setCategory(dto.getCategory());
        p.setSeverity(dto.getSeverity());
        p.setTags(dto.getTags());

        p.setAddressLine(dto.getAddressLine());
        p.setCity(dto.getCity());
        p.setState(dto.getState());
        p.setCountry(dto.getCountry());
        p.setPincode(dto.getPincode());
        p.setLatitude(
        	    dto.getLatitude() != null
        	        ? dto.getLatitude()
        	        : BigDecimal.ZERO
        	);

        	p.setLongitude(
        	    dto.getLongitude() != null
        	        ? dto.getLongitude()
        	        : BigDecimal.ZERO
        	);

        p.setCreatedByUserId(userId);
        p.setStatus("OPEN");

        p.setUpvoteCount(0);
        p.setCommentCount(0);
        p.setViewCount(0);

        p.setIsAnonymous(dto.getIsAnonymous());
        p.setIsDonationEnabled(dto.getIsDonationEnabled());

        p.setTargetAmount(dto.getTargetAmount() == null
                ? BigDecimal.ZERO
                : dto.getTargetAmount());

        p.setAmountRaised(BigDecimal.ZERO);

        p.setCreatedAt(OffsetDateTime.now());
        p.setUpdatedAt(OffsetDateTime.now());

        return problemRepository.save(p);
    }

    @Override
    public Problem updateStatus(Long problemId, StatusUpdateDTO dto) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        String fromStatus = problem.getStatus();
        problem.setStatus(dto.getToStatus());
        problem.setUpdatedAt(OffsetDateTime.now());

        timelineService.addTimeline(
                problemId,
                fromStatus,
                dto.getToStatus(),
                dto.getNote(),
                dto.getChangedByUserId()
        );

        return problemRepository.save(problem);
    }

    @Override
    public List<Problem> getAllProblems() {
        return problemRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Problem> getProblemsByUser(Long userId) {
        return problemRepository.findByCreatedByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void likeProblem(Long problemId, Long userId) {
        if (!likeRepository.existsByProblemIdAndUserId(problemId, userId)) {
            ProblemLike like = new ProblemLike();
            like.setProblemId(problemId);
            like.setUserId(userId);
            like.setLikedAt(OffsetDateTime.now());
            likeRepository.save(like);

            Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            problem.setUpvoteCount(problem.getUpvoteCount() + 1);
            problemRepository.save(problem);
        }
    }

    @Override
    public void unlikeProblem(Long problemId, Long userId) {
        if (likeRepository.existsByProblemIdAndUserId(problemId, userId)) {
            likeRepository.deleteByProblemIdAndUserId(problemId, userId);

            Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            if (problem.getUpvoteCount() > 0) {
                problem.setUpvoteCount(problem.getUpvoteCount() - 1);
                problemRepository.save(problem);
            }
        }
    }
    @Override
    public void shareProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        int currentShares = problem.getShareCount() == null ? 0 : problem.getShareCount();
        problem.setShareCount(currentShares + 1);
        problemRepository.save(problem);
    }

    @Override
    public Problem assignProblem(Long problemId, Long volunteerId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        if (!"OPEN".equals(problem.getStatus())) {
            throw new RuntimeException("Problem is not OPEN");
        }

        problem.setAssignedToUserId(volunteerId);
        problem.setStatus("IN_PROGRESS");
        problem.setUpdatedAt(OffsetDateTime.now());

        timelineService.addTimeline(
                problemId,
                "OPEN",
                "IN_PROGRESS",
                "Volunteer took action",
                volunteerId
        );

        return problemRepository.save(problem);
    }

    @Override
    public Problem resolveProblem(Long problemId, Long volunteerId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Optional: Check if assigned to this volunteer
        // if (!volunteerId.equals(problem.getAssignedToUserId())) { ... }

        String fromStatus = problem.getStatus();
        problem.setStatus("CLOSED"); // or RESOLVED
        problem.setUpdatedAt(OffsetDateTime.now());
        problem.setClosedAt(OffsetDateTime.now());

        timelineService.addTimeline(
                problemId,
                fromStatus,
                "CLOSED",
                "Problem resolved by volunteer",
                volunteerId
        );

        return problemRepository.save(problem);
    }

    @Override
    public List<Problem> getAssignedProblems(Long volunteerId) {
        return problemRepository.findByAssignedToUserIdOrderByCreatedAtDesc(volunteerId);
    }

    @Override
    public Problem updateProblem(Long problemId, ProblemRequestDTO dto) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        if (dto.getAmountSpent() != null) {
            // Mapping amountSpent from DTO to amountRaised in Entity as per user context
            problem.setAmountRaised(dto.getAmountSpent());
        }
        if (dto.getProgress() != null) {
            problem.setProgress(dto.getProgress());
        }
        if (dto.getTeamCount() != null) {
            problem.setTeamCount(dto.getTeamCount());
        }
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            problem.setStatus(dto.getStatus());
        }
        // Can add other fields like title, description updates if needed

        problem.setUpdatedAt(OffsetDateTime.now());
        return problemRepository.save(problem);
    }
}