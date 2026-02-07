package com.urbanmind.urbanmind_auth.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.repository.UserRepository;
import com.urbanmind.urbanmind_auth.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repo;

    public UserServiceImpl(UserRepository repo) {
        this.repo = repo;
    }

    @Override
    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAll() {
        return repo.findAll();
    }

    @Override
    public User update(Long id, User updated) {
        User user = getById(id);

        user.setFullName(updated.getFullName());
        user.setPhone(updated.getPhone());
        user.setProfilePhotoUrl(updated.getProfilePhotoUrl());

        return repo.save(user);
    }

    @Override
    public void updateStatus(Long id, String status) {
        User user = getById(id);
        user.setStatus(status.toUpperCase());
        repo.save(user);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return repo.findByPrimaryRole(role);
    }

    @Override
    public User getUserByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
