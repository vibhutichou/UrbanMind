package com.urbanmind.urbanmind_auth.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.dto.request.CommentRequestDTO;
import com.urbanmind.urbanmind_auth.entity.Comment;
import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.exception.ResourceNotFoundException;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.CommentService;

@RestController
@RequestMapping("/api/problems")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, UserRepository userRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{problemId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long problemId,
            @RequestBody CommentRequestDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new ResponseEntity<>(
                commentService.addComment(problemId, user.getId(), dto.getContent()),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/{problemId}/comments/{commentId}/reply")
    public ResponseEntity<Comment> reply(
            @PathVariable Long problemId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new ResponseEntity<>(
                commentService.reply(problemId, commentId, user.getId(), dto.getContent()),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{problemId}/comments")
    public ResponseEntity<List<com.urbanmind.urbanmind_auth.dto.response.CommentResponseDTO>> getComments(
            @PathVariable Long problemId) {

        List<Comment> comments = commentService.getComments(problemId);

        List<com.urbanmind.urbanmind_auth.dto.response.CommentResponseDTO> response = comments.stream()
                .map(comment -> {
                    com.urbanmind.urbanmind_auth.dto.response.CommentResponseDTO dto = new com.urbanmind.urbanmind_auth.dto.response.CommentResponseDTO();
                    dto.setId(comment.getId());
                    dto.setProblemId(comment.getProblemId());
                    dto.setUserId(comment.getUserId());
                    dto.setParentCommentId(comment.getParentCommentId());
                    dto.setContent(comment.getContent());
                    dto.setIsEdited(comment.getIsEdited());
                    dto.setIsDeleted(comment.getIsDeleted());
                    dto.setCreatedAt(comment.getCreatedAt());

                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    if (user != null) {
                        dto.setAuthorName(user.getFullName());
                        dto.setAuthorUsername(user.getUsername());
                        dto.setAuthorAvatar(user.getFullName().substring(0, 1).toUpperCase());
                    } else {
                        dto.setAuthorName("Anonymous");
                        dto.setAuthorUsername("anon");
                        dto.setAuthorAvatar("A");
                    }
                    
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequestDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(
                commentService.editComment(commentId, user.getId(), dto.getContent())
        );
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteCommentAlias(
            @PathVariable Long commentId,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    
}