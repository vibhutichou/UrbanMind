package com.urbanmind.donationnotification.service;

import com.urbanmind.donationnotification.dto.NotificationRequestDto;
import com.urbanmind.donationnotification.dto.NotificationResponseDto;
import java.util.List;

public interface NotificationService {

    NotificationResponseDto createNotification(NotificationRequestDto notificationRequestDto);

    NotificationResponseDto createBroadcastNotification(NotificationRequestDto notificationRequestDto);

    List<NotificationResponseDto> getNotificationsByUserId(Long userId);

    NotificationResponseDto markAsRead(Long notificationId);

    void deleteNotification(Long notificationId);

    Long getUnreadCount(Long userId);
}
