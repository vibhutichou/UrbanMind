package org.urbanmind.UrbanChats.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.urbanmind.UrbanChats.DTO.ChatRoomRequestDto;
import org.urbanmind.UrbanChats.DTO.ChatRoomResponseDto;
import org.urbanmind.UrbanChats.Entity.ChatRooms;
import org.urbanmind.UrbanChats.Repository.ChatRoomRepository;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    

    public Page<ChatRoomResponseDto> getRoomsForUserPaginated(
            Long userId,
            int page,
            int size) {

        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return chatRoomRepository
                .findByUser1IdOrUser2Id(userId, userId, pageable)
                .map(this::mapToResponse);
    }

    public ChatRoomResponseDto getRoomById(Long roomId, Long userId) {

        ChatRooms room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        // Check if user is part of the room
        if (!room.getUser1Id().equals(userId) && !room.getUser2Id().equals(userId)) {
            throw new IllegalArgumentException("Access denied to this chat room");
        }

        return mapToResponse(room);
    }

    // Create chat room
    public ChatRoomResponseDto createRoom(ChatRoomRequestDto dto) {
    	
    	// Only apply get-or-create logic for PRIVATE chats
        if ("PRIVATE".equalsIgnoreCase(dto.getRoomType())) {

            Optional<ChatRooms> existingRoom =
                    chatRoomRepository.findPrivateRoomBetweenUsers(
                            dto.getUser1Id(),
                            dto.getUser2Id()
                    );

            if (existingRoom.isPresent()) {
                return mapToResponse(existingRoom.get()); // ✅ Return existing room
            }
        }
    	
        ChatRooms room = new ChatRooms();
        room.setRoomType(dto.getRoomType());
        room.setUser1Id(dto.getUser1Id());
        room.setUser2Id(dto.getUser2Id());
        room.setName(dto.getName());
        room.setProblemId(dto.getProblemId());
        room.setCreatedByUserId(dto.getCreatedByUserId());
        room.setCreatedAt(OffsetDateTime.now());

        ChatRooms saved = chatRoomRepository.save(room);

        return mapToResponse(saved);
    }

    // Get rooms for user
    public List<ChatRoomResponseDto> getRoomsForUser(Long userId) {

        return chatRoomRepository
                .findByUser1IdOrUser2Id(userId, userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ChatRoomResponseDto getRoomById(Long roomId) {

        ChatRooms room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        return mapToResponse(room);
    }

    // Mapper
    private ChatRoomResponseDto mapToResponse(ChatRooms room) {

        ChatRoomResponseDto dto = new ChatRoomResponseDto();
        dto.setId(room.getId());
        dto.setRoomType(room.getRoomType());
        dto.setUser1Id(room.getUser1Id());
        dto.setUser2Id(room.getUser2Id());
        dto.setName(room.getName());
        dto.setProblemId(room.getProblemId());
        dto.setCreatedByUserId(room.getCreatedByUserId());
        dto.setCreatedAt(room.getCreatedAt());

        return dto;
    }
}
