package com.urbanmind.urbanmind_auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.urbanmind.urbanmind_auth.entity.ProblemMedia;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.exception.ResourceNotFoundException;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.ProblemMediaService;

@RestController
@RequestMapping("/api/problems")

public class ProblemMediaController {

    private final ProblemMediaService mediaService;
    private final UserRepository userRepository;

    public ProblemMediaController(ProblemMediaService mediaService, UserRepository userRepository) {
        this.mediaService = mediaService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{problemId}/media")
    public ResponseEntity<ProblemMedia> addMedia(
            @PathVariable Long problemId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new ResponseEntity<>(
                mediaService.addMedia(problemId, file, user.getId()),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{problemId}/media")
    public ResponseEntity<List<ProblemMedia>> getMedia(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                mediaService.getMediaByProblem(problemId)
        );
    }
}
