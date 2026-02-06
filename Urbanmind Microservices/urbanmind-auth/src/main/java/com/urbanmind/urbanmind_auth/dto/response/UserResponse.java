package com.urbanmind.urbanmind_auth.dto.response;

import com.urbanmind.urbanmind_auth.entity.User;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String status;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.id = user.getId();
        r.username = user.getUsername();
        r.email = user.getEmail();
        r.fullName = user.getFullName();
        r.phone = user.getPhone();
        r.role = user.getPrimaryRole();
        r.status = user.getStatus();
        return r;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
}
