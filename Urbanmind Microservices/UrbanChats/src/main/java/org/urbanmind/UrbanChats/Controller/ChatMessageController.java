
package org.urbanmind.UrbanChats.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.urbanmind.UrbanChats.DTO.ChatMessageRequestDto;
import org.urbanmind.UrbanChats.DTO.ChatMessageResponseDto;
import org.urbanmind.UrbanChats.Service.ChatMessageService;

@RestController
@RequestMapping("/api/v1/chats")
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

 // Send message in a room
    @PostMapping("/rooms/{roomId}/messages")
    //@PreAuthorize("#dto.senderUserId == authentication.principal.id")
    @PreAuthorize("#dto.createdByUserId.toString() == authentication.name")
    public ChatMessageResponseDto sendMessage(
            @PathVariable Long roomId,
            @jakarta.validation.Valid
            @RequestBody ChatMessageRequestDto dto) {

        dto.setRoomId(roomId);
        return chatMessageService.sendMessage(dto);
    }

    @GetMapping("/rooms/{roomId}/messages")
    @PreAuthorize("isAuthenticated()")
    public Page<ChatMessageResponseDto> getMessagesPaginated(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return chatMessageService.getMessagesPaginated(roomId, page, size);
    }

    @PostMapping("/rooms/{roomId}/read")
    @PreAuthorize("isAuthenticated()")
    public void markMessagesAsRead(
            @PathVariable Long roomId,
            @RequestParam Long userId) {

        chatMessageService.markRoomMessagesAsRead(roomId, userId);
    }


//    // Get messages by room
//    @GetMapping("/rooms/{roomId}/messages")
//    @PreAuthorize("isAuthenticated()")
//    public List<ChatMessageResponseDto> getMessages(
//            @PathVariable Long roomId) {
//        return chatMessageService.getMessagesByRoom(roomId);
//    }

    // Delete message (moderation placeholder)
    @DeleteMapping("/messages/{messageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMessage(@PathVariable Long messageId) {
        chatMessageService.deleteMessage(messageId);
    }

}
