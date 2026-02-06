package com.urbanmind.donationnotification.controller;

import com.urbanmind.donationnotification.dto.NotificationRequestDto;
import com.urbanmind.donationnotification.dto.NotificationResponseDto;
import com.urbanmind.donationnotification.exception.ApiResponse;
import com.urbanmind.donationnotification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    /*
     * @PostMapping
     * public ResponseEntity<ApiResponse> createNotification(@Valid @RequestBody
     * NotificationRequestDto notificationRequestDto) {
     * NotificationResponseDto notification =
     * notificationService.createNotification(notificationRequestDto);
     * ApiResponse response = new ApiResponse(true,
     * "Notification created successfully", notification);
     * return new ResponseEntity<>(response, HttpStatus.CREATED);
     * }
     */

    @PostMapping
    public ApiResponse createNotification(@RequestBody NotificationRequestDto dto) {
        NotificationResponseDto notification = notificationService.createNotification(dto);
        return new ApiResponse(true, "Notification created", notification);
    }

    @PostMapping("/broadcast")
    public ApiResponse createBroadcastNotification(@RequestBody NotificationRequestDto dto) {
        NotificationResponseDto notification = notificationService.createBroadcastNotification(dto);
        return new ApiResponse(true, "Broadcast sent", notification);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getNotifications(@PathVariable Long userId) {
        List<NotificationResponseDto> notifications = notificationService.getNotificationsByUserId(userId);
        ApiResponse response = new ApiResponse(true, "Notifications retrieved successfully", notifications);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        NotificationResponseDto notification = notificationService.markAsRead(id);
        ApiResponse response = new ApiResponse(true, "Notification marked as read", notification);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        ApiResponse response = new ApiResponse(true, "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse> getUnreadCount(@RequestParam Long userId) {
        Long count = notificationService.getUnreadCount(userId);
        ApiResponse response = new ApiResponse(true, "Unread count retrieved successfully", count);
        return ResponseEntity.ok(response);
    }
}
