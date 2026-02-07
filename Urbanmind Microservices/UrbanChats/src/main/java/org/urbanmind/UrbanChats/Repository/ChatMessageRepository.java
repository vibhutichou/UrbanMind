package org.urbanmind.UrbanChats.Repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.urbanmind.UrbanChats.Entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);
    Page<ChatMessage> findByRoomId(Long roomId, Pageable pageable);
   

    @Transactional
    @Modifying
    @Query("""
    UPDATE ChatMessage m
    SET m.isRead = true,
        m.readAt = CURRENT_TIMESTAMP
    WHERE m.roomId = :roomId
      AND m.senderUserId <> :userId
      AND m.isRead = false
    """)
    void markMessagesAsRead(Long roomId, Long userId);


}

