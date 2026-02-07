package com.urbanmind.donationnotification.service;

import com.urbanmind.donationnotification.dto.NotificationResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(Long userId, NotificationResponseDto notification) {
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + userId,
                notification);
    }

    public void sendBroadcast(NotificationResponseDto notification) {
        messagingTemplate.convertAndSend(
                "/topic/announcements",
                notification);
    }
}
