package com.urbanmind.urbanmind_auth.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(
    name = "problem_timeline",
    indexes = @Index(
        name = "idx_problem_timeline_problem",
        columnList = "problem_id"
    )
)
public class ProblemTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "from_status", nullable = false)
    private String fromStatus;

    @Column(name = "to_status", nullable = false)
    private String toStatus;

    @Column(length = 500)
    private String note;

    @Column(name = "changed_by_user_id", nullable = false)
    private Long changedByUserId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

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
	public String getFromStatus() {
		return fromStatus;
	}
	public void setFromStatus(String fromStatus) {
		this.fromStatus = fromStatus;
	}
	public String getToStatus() {
		return toStatus;
	}
	public void setToStatus(String toStatus) {
		this.toStatus = toStatus;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public Long getChangedByUserId() {
		return changedByUserId;
	}
	public void setChangedByUserId(Long changedByUserId) {
		this.changedByUserId = changedByUserId;
	}
	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

}