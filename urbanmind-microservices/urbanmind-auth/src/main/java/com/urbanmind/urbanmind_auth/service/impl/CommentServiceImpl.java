package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.entity.Comment;
import com.urbanmind.urbanmind_auth.entity.Problem;
import com.urbanmind.urbanmind_auth.repository.CommentRepository;
import com.urbanmind.urbanmind_auth.repository.ProblemRepository;
import com.urbanmind.urbanmind_auth.service.CommentService;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ProblemRepository problemRepository;

    public CommentServiceImpl(CommentRepository commentRepository, ProblemRepository problemRepository) {
        this.commentRepository = commentRepository;
        this.problemRepository = problemRepository;
    }

    @Override
    public Comment addComment(Long problemId, Long userId, String content) {

        Comment comment = new Comment();
        comment.setProblemId(problemId);
        comment.setUserId(userId);
        comment.setContent(content);
        comment.setIsEdited(false);
        comment.setIsDeleted(false);
        comment.setCreatedAt(OffsetDateTime.now());
        comment.setUpdatedAt(OffsetDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        // Update problem comment count
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problem.setCommentCount(problem.getCommentCount() + 1);
        problemRepository.save(problem);

        return savedComment;
    }

    @Override
    public Comment reply(Long problemId,
                         Long parentCommentId,
                         Long userId,
                         String content) {

        Comment parent = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        if (!parent.getProblemId().equals(problemId)) {
            throw new RuntimeException("Parent comment does not belong to this problem");
        }

        Comment reply = new Comment();
        reply.setProblemId(problemId);
        reply.setUserId(userId);
        reply.setParentCommentId(parentCommentId);
        reply.setContent(content);
        reply.setIsEdited(false);
        reply.setIsDeleted(false);
        reply.setCreatedAt(OffsetDateTime.now());
        reply.setUpdatedAt(OffsetDateTime.now());

        return commentRepository.save(reply);
    }

    @Override
    public List<Comment> getComments(Long problemId) {
        return commentRepository
                .findByProblemIdAndParentCommentIdIsNullAndIsDeletedFalse(problemId);
    }

    @Override
    public Comment editComment(Long commentId,
                               Long userId,
                               String content) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to edit this comment");
        }

        comment.setContent(content);
        comment.setIsEdited(true);
        comment.setUpdatedAt(OffsetDateTime.now());

        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long commentId, Long userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        comment.setIsDeleted(true);
        comment.setUpdatedAt(OffsetDateTime.now());

        commentRepository.save(comment);

        // Update problem comment count
        Problem problem = problemRepository.findById(comment.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        // Ensure count doesn't go below 0
        if (problem.getCommentCount() > 0) {
            problem.setCommentCount(problem.getCommentCount() - 1);
            problemRepository.save(problem);
        }
    }
}
