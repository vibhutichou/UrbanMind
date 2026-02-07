package com.urbanmind.urbanmind_auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank
    private String email;

	

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		// TODO Auto-generated method stub
		return email;
	}
}
