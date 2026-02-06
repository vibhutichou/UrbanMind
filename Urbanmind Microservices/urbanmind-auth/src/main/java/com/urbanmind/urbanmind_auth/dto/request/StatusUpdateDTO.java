package com.urbanmind.urbanmind_auth.dto.request;

// Short: DTO used to request a status transition for a Problem
public class StatusUpdateDTO {
    // Target status (e.g., OPEN -> IN_PROGRESS -> RESOLVED)
    private String toStatus;
    // Optional note explaining the change
    private String note;
    // ID of the user making the change
    private Long changedByUserId;

    // getters and setters
    
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
    
    
}