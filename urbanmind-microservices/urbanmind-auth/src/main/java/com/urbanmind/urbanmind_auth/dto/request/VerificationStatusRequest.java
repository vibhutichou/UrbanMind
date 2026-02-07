package com.urbanmind.urbanmind_auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public class VerificationStatusRequest {

    @NotBlank
    private String status; // APPROVED / REJECTED

    private String adminComment;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminComment() {
        return adminComment;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }
}
