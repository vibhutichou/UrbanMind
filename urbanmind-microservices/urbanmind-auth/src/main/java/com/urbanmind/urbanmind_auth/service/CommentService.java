package com.urbanmind.urbanmind_auth.service;

import java.util.List;
import com.urbanmind.urbanmind_auth.entity.Comment;

public interface CommentService {

    Comment addComment(Long problemId, Long userId, String content);

    Comment reply(Long problemId, Long parentCommentId, Long userId, String content);

    List<Comment> getComments(Long problemId);

    Comment editComment(Long commentId, Long userId, String content);

    void deleteComment(Long commentId, Long userId);
}
