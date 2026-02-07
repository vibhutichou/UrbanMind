package com.urbanmind.urbanmind_auth.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(
    name = "comments",
    indexes = @Index(
        name = "idx_comments_problem",
        columnList = "problem_id"
    )
)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "parent_comment_id")
    private Long parentCommentId;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(name = "is_edited", nullable = false)
    private Boolean isEdited = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // getters and setters

 // getters and setters
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getProblemId() {
		return problemId;
	}
	public void setProblemId(Long problemId) {
		this.problemId = problemId;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Long getParentCommentId() {
		return parentCommentId;
	}
	public void setParentCommentId(Long parentCommentId) {
		this.parentCommentId = parentCommentId;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Boolean getIsEdited() {
		return isEdited;
	}
	public void setIsEdited(Boolean isEdited) {
		this.isEdited = isEdited;
	}
	public Boolean getIsDeleted() {
		return isDeleted;
	}
	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(OffsetDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}