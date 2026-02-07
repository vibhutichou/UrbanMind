package com.urbanmind.urbanmind_auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.urbanmind.urbanmind_auth.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Root comments (not deleted)
    List<Comment> findByProblemIdAndParentCommentIdIsNullAndIsDeletedFalse(Long problemId);

    // Replies for a comment (not deleted)
    List<Comment> findByParentCommentIdAndIsDeletedFalse(Long parentCommentId);
}
