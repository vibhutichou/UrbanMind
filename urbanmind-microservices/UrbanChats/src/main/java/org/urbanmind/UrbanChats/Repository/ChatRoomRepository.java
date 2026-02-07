package org.urbanmind.UrbanChats.Repository;



import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.urbanmind.UrbanChats.Entity.ChatRooms;

public interface ChatRoomRepository extends JpaRepository<ChatRooms, Long> {

    List<ChatRooms> findByUser1IdOrUser2Id(Long user1Id, Long user2Id);
    

    Page<ChatRooms> findByUser1IdOrUser2Id(
            Long user1Id,
            Long user2Id,
            Pageable pageable
    );
    
    @Query("""
            SELECT r FROM ChatRooms r
            WHERE r.roomType = 'PRIVATE'
            AND (
                (r.user1Id = :user1 AND r.user2Id = :user2)
                OR
                (r.user1Id = :user2 AND r.user2Id = :user1)
            )
        """)
        Optional<ChatRooms> findPrivateRoomBetweenUsers(Long user1, Long user2);

}

