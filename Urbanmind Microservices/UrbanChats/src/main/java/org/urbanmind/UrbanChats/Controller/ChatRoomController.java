
package org.urbanmind.UrbanChats.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.urbanmind.UrbanChats.DTO.ChatRoomRequestDto;
import org.urbanmind.UrbanChats.DTO.ChatRoomResponseDto;
import org.urbanmind.UrbanChats.Service.ChatRoomService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1/chats/rooms")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    // Create chat room
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ChatRoomResponseDto createRoom(
            @Valid @RequestBody ChatRoomRequestDto dto,
            Authentication authentication) {

        Long loggedInUserId = (Long) authentication.getPrincipal(); // ✅ Direct cast
        dto.setCreatedByUserId(loggedInUserId);

        return chatRoomService.createRoom(dto);
    }
//    @PostMapping
//    @PreAuthorize("#dto.createdByUserId == authentication.principal.id")
//    public ChatRoomResponseDto createRoom(
//            @jakarta.validation.Valid
//            @RequestBody ChatRoomRequestDto dto) {
//
//        return chatRoomService.createRoom(dto);
//    }


    // Get all rooms for a user
//    @GetMapping
//    @PreAuthorize("#userId == authentication.principal.id")
//    public List<ChatRoomResponseDto> getRoomsForUser(
//            @RequestParam Long userId) {
//        return chatRoomService.getRoomsForUser(userId);
//    }
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public org.springframework.data.domain.Page<ChatRoomResponseDto> getRoomsForUser(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return chatRoomService.getRoomsForUserPaginated(userId, page, size);
    }

    
    @GetMapping("/{roomId}")
    @PreAuthorize("isAuthenticated()")
    public ChatRoomResponseDto getRoomById(
            @PathVariable Long roomId,
            org.springframework.security.core.Authentication authentication) {

        String userIdStr = authentication.getName(); // subject from JWT
        Long userId = Long.parseLong(userIdStr);

        return chatRoomService.getRoomById(roomId, userId);
    }

//    // Get room by ID (placeholder for now)
//    @GetMapping("/{roomId}")
//    @PreAuthorize("isAuthenticated()")
//    public ChatRoomResponseDto getRoomById(@PathVariable Long roomId) {
//        // will be implemented in service later
//        return null;
//    }
}
