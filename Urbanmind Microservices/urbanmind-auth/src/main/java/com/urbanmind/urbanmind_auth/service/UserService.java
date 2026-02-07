package com.urbanmind.urbanmind_auth.service;

import java.util.List;

import com.urbanmind.urbanmind_auth.entity.User;

public interface UserService {

    User getById(Long id);

    List<User> getAll();

    User update(Long id, User user);

    void updateStatus(Long id, String status);

    List<User> getUsersByRole(String role);
    
    User getUserByEmail(String email);
}
