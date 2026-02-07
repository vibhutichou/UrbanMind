package org.urbanmind.UrbanChats.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportRequestDto {

    @NotNull(message = "reporterUserId is required")
    private Long reporterUserId;

    @NotBlank(message = "targetType is required")
    @Size(max = 50, message = "targetType cannot exceed 50 characters")
    private String targetType;

    @NotNull(message = "targetId is required")
    private Long targetId;

    @NotBlank(message = "reasonCode is required")
    @Size(max = 50, message = "reasonCode cannot exceed 50 characters")
    private String reasonCode;

    @Size(max = 500, message = "reasonText cannot exceed 500 characters")
    private String reasonText;

    // getters & setters

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
}
