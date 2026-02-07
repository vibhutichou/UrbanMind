package org.urbanmind.UrbanChats.Entity;


import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reports")
public class Reports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_user_id", nullable = false)
    private Long reporterUserId;

    @Column(name = "target_type", length = 30, nullable = false)
    private String targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "reason_code", length = 50)
    private String reasonCode;

    @Column(name = "reason_text", columnDefinition = "text")
    private String reasonText;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "handled_by_admin_id")
    private Long handledByAdminId;

    @Column(name = "action", length = 50)
    private String action;

    @Column(name = "action_reason", columnDefinition = "text")
    private String actionReason;

    @Column(name = "handled_at")
    private OffsetDateTime handledAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Reports() {
		super();
	}

	public Reports(Long id, Long reporterUserId, String targetType, Long targetId, String reasonCode, String reasonText,
			String status, Long handledByAdminId, String action, String actionReason, OffsetDateTime handledAt,
			OffsetDateTime createdAt, OffsetDateTime updatedAt) {
		super();
		this.id = id;
		this.reporterUserId = reporterUserId;
		this.targetType = targetType;
		this.targetId = targetId;
		this.reasonCode = reasonCode;
		this.reasonText = reasonText;
		this.status = status;
		this.handledByAdminId = handledByAdminId;
		this.action = action;
		this.actionReason = actionReason;
		this.handledAt = handledAt;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// -------- getters & setters --------

    @Override
	public String toString() {
		return "Reports [id=" + id + ", reporterUserId=" + reporterUserId + ", targetType=" + targetType + ", targetId="
				+ targetId + ", reasonCode=" + reasonCode + ", reasonText=" + reasonText + ", status=" + status
				+ ", handledByAdminId=" + handledByAdminId + ", action=" + action + ", actionReason=" + actionReason
				+ ", handledAt=" + handledAt + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
	}

	public Long getId() {
        return id;
    }

    public Long getReporterUserId() {
        return reporterUserId;
    }

    public void setReporterUserId(Long reporterUserId) {
        this.reporterUserId = reporterUserId;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getReasonCode() {
        return reasonCode;
    }

    public void setReasonCode(String reasonCode) {
        this.reasonCode = reasonCode;
    }

    public String getReasonText() {
        return reasonText;
    }

    public void setReasonText(String reasonText) {
        this.reasonText = reasonText;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getHandledByAdminId() {
        return handledByAdminId;
    }

    public void setHandledByAdminId(Long handledByAdminId) {
        this.handledByAdminId = handledByAdminId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActionReason() {
        return actionReason;
    }

    public void setActionReason(String actionReason) {
        this.actionReason = actionReason;
    }

    public OffsetDateTime getHandledAt() {
        return handledAt;
    }

    public void setHandledAt(OffsetDateTime handledAt) {
        this.handledAt = handledAt;
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

