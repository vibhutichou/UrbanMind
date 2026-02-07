package com.urbanmind.urbanmind_auth.dto.request;
import jakarta.validation.constraints.NotBlank;

// Short: DTO for creating or replying to a comment; content is required
public class CommentRequestDTO {
    // Required: the text content of the comment
    @NotBlank
    private String content;
    // Optional: id of the user making the comment (null for anonymous)
    private Long userId;
    
    
    // getters and setters
    
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
    
   
}
