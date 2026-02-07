package com.urbanmind.urbanmind_auth.dto.response;

public class RegisterResponse {

    private Long id;
    private String role;

    public RegisterResponse(Long id, String role) {
        this.id = id;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getRole() { return role; }
}
