package com.urbanmind.urbanmind_auth.dto.request;

public class VerificationCreateRequest {
    private String documentUrl;
    private String notes;
    // CHANGE: Add requestedRole for dynamic role upgrades (e.g., "VOLUNTEER" or "NGO")
    private String requestedRole;

    // Getters and setters
    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // CHANGE: Add getter/setter for requestedRole
    public String getRequestedRole() { return requestedRole; }
    public void setRequestedRole(String requestedRole) { this.requestedRole = requestedRole; }
}