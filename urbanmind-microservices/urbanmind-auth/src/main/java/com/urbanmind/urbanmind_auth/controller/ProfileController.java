package com.urbanmind.urbanmind_auth.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.urbanmind.urbanmind_auth.entity.User;
import com.urbanmind.urbanmind_auth.service.UserService;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllProfiles(@RequestParam(required = false, defaultValue = "all") String role) {
        if ("all".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(userService.getAll());
        }
        return ResponseEntity.ok(userService.getUsersByRole(role.toUpperCase()));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        // If security context is not set, principal might be null
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getUserByEmail(principal.getName()));
    }
}
