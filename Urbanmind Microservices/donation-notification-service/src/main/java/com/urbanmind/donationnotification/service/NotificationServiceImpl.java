package com.urbanmind.donationnotification.service;

import com.urbanmind.donationnotification.dto.NotificationRequestDto;
import com.urbanmind.donationnotification.dto.NotificationResponseDto;
import com.urbanmind.donationnotification.entity.Notification;
import com.urbanmind.donationnotification.exception.ResourceNotFoundException;
import com.urbanmind.donationnotification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    private NotificationSocketService socketService;
    
    private final com.urbanmind.donationnotification.repository.UserRepository userRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, com.urbanmind.donationnotification.repository.UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public NotificationResponseDto createNotification(NotificationRequestDto notificationRequestDto) {
        Notification notification = new Notification();
        notification.setUserId(notificationRequestDto.getUserId());
        notification.setTitle(notificationRequestDto.getTitle());
        notification.setMessage(notificationRequestDto.getMessage());
        notification.setType(notificationRequestDto.getType());
        notification.setChannel(notificationRequestDto.getChannel());
        notification.setReferenceType(notificationRequestDto.getReferenceType());
        notification.setReferenceId(notificationRequestDto.getReferenceId());
        notification.setIsRead(false);
        notification.setSentAt(OffsetDateTime.now());
        notification.setCreatedAt(OffsetDateTime.now());

        Notification savedNotification = notificationRepository.save(notification);

        NotificationResponseDto responseDto = convertToResponseDto(savedNotification);

        // 🔥 WebSocket trigger here (NO ProblemService needed)
        socketService.sendNotification(notification.getUserId(), responseDto);

        return responseDto;

    }

    @Override
    @Transactional
    public NotificationResponseDto createBroadcastNotification(NotificationRequestDto notificationRequestDto) {
        
        // Prepare the broadcast payload (what users see in real-time)
        NotificationResponseDto broadcastDto = new NotificationResponseDto();
        broadcastDto.setTitle(notificationRequestDto.getTitle());
        broadcastDto.setMessage(notificationRequestDto.getMessage());
        broadcastDto.setType(notificationRequestDto.getType());
        broadcastDto.setChannel(notificationRequestDto.getChannel());
        broadcastDto.setReferenceType(notificationRequestDto.getReferenceType());
        broadcastDto.setReferenceId(notificationRequestDto.getReferenceId());
        broadcastDto.setIsRead(false);
        broadcastDto.setUserId(0L); // Broadcast doesn't belong to one user in the socket channel
        broadcastDto.setSentAt(OffsetDateTime.now());
        broadcastDto.setCreatedAt(OffsetDateTime.now());

        // 1. Fetch ALL users from Database directly
        try {
            List<com.urbanmind.donationnotification.entity.User> users = userRepository.findAll();

            if (users != null) {
                for (com.urbanmind.donationnotification.entity.User user : users) {
                    Notification notification = new Notification();
                    notification.setUserId(user.getId());
                    notification.setTitle(notificationRequestDto.getTitle());
                    notification.setMessage(notificationRequestDto.getMessage());
                    notification.setType(notificationRequestDto.getType());
                    notification.setChannel(notificationRequestDto.getChannel());
                    notification.setReferenceType(notificationRequestDto.getReferenceType());
                    notification.setReferenceId(notificationRequestDto.getReferenceId());
                    notification.setIsRead(false);
                    notification.setSentAt(broadcastDto.getSentAt());
                    notification.setCreatedAt(broadcastDto.getCreatedAt());

                    notificationRepository.save(notification);
                }
            }
        } catch (Exception e) {
           System.err.println("Failed to fetch users or save notifications: " + e.getMessage());
           e.printStackTrace();
        }

        // 🔥 WebSocket Broadcast with the ACTUAL content
        socketService.sendBroadcast(broadcastDto);

        return broadcastDto;
    }

    @Override
    public List<NotificationResponseDto> getNotificationsByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationResponseDto markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        notification.setIsRead(true);
        notification.setReadAt(OffsetDateTime.now());

        Notification updatedNotification = notificationRepository.save(notification);
        return convertToResponseDto(updatedNotification);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        notificationRepository.delete(notification);
    }

    @Override
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    private NotificationResponseDto convertToResponseDto(Notification notification) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId() != null ? notification.getUserId() : 0L);

        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setChannel(notification.getChannel());
        dto.setReferenceType(notification.getReferenceType());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setReadAt(notification.getReadAt());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setSentAt(notification.getSentAt());
        return dto;
    }
}