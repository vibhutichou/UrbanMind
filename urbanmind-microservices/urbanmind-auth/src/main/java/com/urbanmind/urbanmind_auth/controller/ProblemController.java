package com.urbanmind.urbanmind_auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.urbanmind.urbanmind_auth.dto.request.ProblemRequestDTO;
import com.urbanmind.urbanmind_auth.dto.response.ProblemResponseDTO;
import com.urbanmind.urbanmind_auth.entity.Problem;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.exception.ResourceNotFoundException;
import com.urbanmind.urbanmind_auth.repository.ProblemLikeRepository;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.ProblemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/problems")

public class ProblemController {

    private final ProblemService problemService;
    private final UserRepository userRepository;
    private final ProblemLikeRepository likeRepository;

    public ProblemController(
            ProblemService problemService,
            UserRepository userRepository,
            ProblemLikeRepository likeRepository) {

        this.problemService = problemService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

    // ===============================
    // CREATE PROBLEM
    // ===============================
    @PostMapping
    public ResponseEntity<Problem> createProblem(
            @Valid @RequestBody ProblemRequestDTO dto,
            Authentication authentication) {

        User user = getUser(authentication);

        return new ResponseEntity<>(
                problemService.createProblem(dto, user.getId()),
                HttpStatus.CREATED
        );
    }

    // ===============================
    // HOME FEED (ALL PROBLEMS)
    // ===============================
    @GetMapping
    public ResponseEntity<List<ProblemResponseDTO>> getAllProblems(
            Authentication authentication) {

        User viewer = authentication != null ? getUser(authentication) : null;

        List<ProblemResponseDTO> response = problemService.getAllProblems()
                .stream()
                .map(p -> mapToDTO(p, viewer))
                .toList();

        return ResponseEntity.ok(response);
    }

    // ===============================
    // MY PROBLEMS
    // ===============================
    @GetMapping("/my")
    public List<ProblemResponseDTO> getMyProblems(Authentication authentication) {

        User viewer = getUser(authentication);

        return problemService.getProblemsByUser(viewer.getId())
                .stream()
                .map(p -> mapToDTO(p, viewer))
                .toList();
    }

    // ===============================
    // LIKE
    // ===============================
    @PostMapping("/{problemId}/like")
    public ResponseEntity<Void> likeProblem(
            @PathVariable Long problemId,
            Authentication authentication) {

        User user = getUser(authentication);
        problemService.likeProblem(problemId, user.getId());
        return ResponseEntity.ok().build();
    }

    // ===============================
    // UNLIKE
    // ===============================
    @DeleteMapping("/{problemId}/like")
    public ResponseEntity<Void> unlikeProblem(
            @PathVariable Long problemId,
            Authentication authentication) {

        User user = getUser(authentication);
        problemService.unlikeProblem(problemId, user.getId());
        return ResponseEntity.ok().build();
    }

    // ===============================
    // SHARE
    // ===============================
    @PostMapping("/{problemId}/share")
    public ResponseEntity<Void> shareProblem(@PathVariable Long problemId) {
        problemService.shareProblem(problemId);
        return ResponseEntity.ok().build();
    }

    // ===============================
    // VOLUNTEER ACTIONS
    // ===============================
    @PostMapping("/{problemId}/assign")
    public ResponseEntity<ProblemResponseDTO> assignProblem(
            @PathVariable Long problemId,
            Authentication authentication) {
        
        User user = getUser(authentication);
        Problem updated = problemService.assignProblem(problemId, user.getId());
        return ResponseEntity.ok(mapToDTO(updated, user));
    }

    @PostMapping("/{problemId}/resolve")
    public ResponseEntity<ProblemResponseDTO> resolveProblem(
            @PathVariable Long problemId,
            Authentication authentication) {
        
        User user = getUser(authentication);
        Problem updated = problemService.resolveProblem(problemId, user.getId());
        return ResponseEntity.ok(mapToDTO(updated, user));
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<ProblemResponseDTO>> getAssignedProblems(
            Authentication authentication) {
        
        User user = getUser(authentication);
        List<ProblemResponseDTO> response = problemService.getAssignedProblems(user.getId())
                .stream()
                .map(p -> mapToDTO(p, user))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{problemId}")
    public ResponseEntity<ProblemResponseDTO> updateProblem(
            @PathVariable Long problemId,
            @RequestBody ProblemRequestDTO dto,
            Authentication authentication) {
        
        User user = getUser(authentication);
        // Add check if user is authorized to update (e.g. is the assignee or owner)
        // For now, assuming anyone authenticated can try, service/logic might restrict but currently open.
        
        Problem updated = problemService.updateProblem(problemId, dto);
        return ResponseEntity.ok(mapToDTO(updated, user));
    }

    // =================================================
    // 🔥 SINGLE SOURCE OF TRUTH — DTO MAPPER
    // =================================================
    private ProblemResponseDTO mapToDTO(Problem problem, User viewer) {

        User author = userRepository.findById(problem.getCreatedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean anonymous = Boolean.TRUE.equals(problem.getIsAnonymous());

        String name = anonymous ? "Anonymous" : author.getFullName();

        String username = anonymous
                ? "anonymous"
                : (author.getUsername() != null && !author.getUsername().isBlank()
                    ? author.getUsername()
                    : author.getEmail().split("@")[0]);

        boolean isLiked = false;
        if (viewer != null) {
            isLiked = likeRepository.existsByProblemIdAndUserId(
                    problem.getId(),
                    viewer.getId()
            );
        }

        String coverImageUrl = null;
        if (problem.getMedia() != null && !problem.getMedia().isEmpty()) {
            coverImageUrl = problem.getMedia().get(0).getMediaUrl();
        }

        ProblemResponseDTO dto = new ProblemResponseDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setStatus(problem.getStatus());
        dto.setAnonymous(anonymous);
        dto.setCategory(problem.getCategory());
        dto.setCreatedAt(problem.getCreatedAt());

        dto.setAuthorName(name);
        dto.setAuthorUsername(username);
        dto.setAuthorAvatar(name.substring(0, 1).toUpperCase());

        dto.setCity(problem.getCity());
        dto.setState(problem.getState());

        dto.setUpvoteCount(problem.getUpvoteCount());
        dto.setCommentCount(problem.getCommentCount());
        dto.setShareCount(problem.getShareCount());
        dto.setCoverImageUrl(coverImageUrl);
        
        dto.setDonationRequired(problem.getDonationRequired());
        dto.setRequiredAmount(problem.getRequiredAmount());

        // 🔥 THIS CONTROLS PINK LIKE BUTTON
        if (problem.getTags() != null && !problem.getTags().isEmpty()) {
            dto.setTags(java.util.Arrays.asList(problem.getTags().split(",")));
        } else {
            dto.setTags(new java.util.ArrayList<>());
        }



        dto.setIsLiked(isLiked);
        
        dto.setProgress(problem.getProgress());
        dto.setTeamCount(problem.getTeamCount());
        dto.setAmountRaised(problem.getAmountRaised());
        dto.setAssignedToUserId(problem.getAssignedToUserId());
        
        if (problem.getAssignedToUserId() != null) {
             userRepository.findById(problem.getAssignedToUserId())
                 .ifPresent(u -> dto.setAssignedToUserName(u.getFullName()));
        }

        return dto;
    }

    // ===============================
    // AUTH HELPER
    // ===============================
    private User getUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("Unauthenticated request");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}