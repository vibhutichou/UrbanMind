package org.urbanmind.UrbanChats.DTO;


import java.time.OffsetDateTime;
import java.util.List;

public class ErrorResponseDto {

    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private List<String> details;

    public ErrorResponseDto() {
        this.timestamp = OffsetDateTime.now();
    }

    public ErrorResponseDto(int status, String error, String message) {
        this.timestamp = OffsetDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public ErrorResponseDto(int status, String error, String message, List<String> details) {
        this.timestamp = OffsetDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.details = details;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}

