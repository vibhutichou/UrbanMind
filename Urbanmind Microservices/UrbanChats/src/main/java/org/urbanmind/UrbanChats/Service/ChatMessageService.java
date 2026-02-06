package org.urbanmind.UrbanChats.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.urbanmind.UrbanChats.DTO.ChatMessageRequestDto;
import org.urbanmind.UrbanChats.DTO.ChatMessageResponseDto;
import org.urbanmind.UrbanChats.Entity.ChatMessage;
import org.urbanmind.UrbanChats.Repository.ChatMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // Send message
    public ChatMessageResponseDto sendMessage(ChatMessageRequestDto dto) {

        ChatMessage message = new ChatMessage();
        message.setRoomId(dto.getRoomId());
        message.setSenderUserId(dto.getSenderUserId());
        message.setContent(dto.getContent());
        message.setMediaUrl(dto.getMediaUrl());
        message.setMediaType(dto.getMediaType());
        message.setIsRead(false);
        message.setCreatedAt(OffsetDateTime.now());

        ChatMessage saved = chatMessageRepository.save(message);

        return mapToResponse(saved);
    }

//    public ChatMessage saveFromWebSocket(Long roomId, Long senderUserId, String content) {
//
//        ChatMessage message = new ChatMessage();
//        message.setRoomId(roomId);
//        message.setSenderUserId(senderUserId);
//        message.setContent(content);
//
//        return chatMessageRepository.save(message);
//    }
    
    public void markRoomMessagesAsRead(Long roomId, Long userId) {
        chatMessageRepository.markMessagesAsRead(roomId, userId);
    }


    public Page<ChatMessageResponseDto> getMessagesPaginated(
            Long roomId,
            int page,
            int size) {

        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return chatMessageRepository
                .findByRoomId(roomId, pageable)
                .map(this::mapToResponse);
    }


    @Transactional
    public ChatMessage saveFromWebSocket(Long roomId, Long senderUserId, String content) {

        ChatMessage message = new ChatMessage();
        message.setRoomId(roomId);
        message.setSenderUserId(senderUserId);
        message.setContent(content);

        System.out.println("DEBUG isRead before save = " + message.getIsRead());

        return chatMessageRepository.save(message);
    }

    // Get messages by room
    public List<ChatMessageResponseDto> getMessagesByRoom(Long roomId) {

        return chatMessageRepository
                .findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteMessage(Long messageId) {

        if (!chatMessageRepository.existsById(messageId)) {
            throw new RuntimeException("Message not found");
        }

        chatMessageRepository.deleteById(messageId);
    }

    // Mapper
    private ChatMessageResponseDto mapToResponse(ChatMessage message) {

        ChatMessageResponseDto dto = new ChatMessageResponseDto();
        dto.setId(message.getId());
        dto.setRoomId(message.getRoomId());
        dto.setSenderUserId(message.getSenderUserId());
        dto.setContent(message.getContent());
        dto.setMediaUrl(message.getMediaUrl());
        dto.setMediaType(message.getMediaType());
        dto.setIsRead(message.getIsRead());
        dto.setReadAt(message.getReadAt());
        dto.setCreatedAt(message.getCreatedAt());

        return dto;
    }
}

