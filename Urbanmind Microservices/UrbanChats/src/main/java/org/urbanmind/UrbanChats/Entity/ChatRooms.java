package org.urbanmind.UrbanChats.Entity;



import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_type", length = 20)
    private String roomType;

    @Column(name = "user1_id")
    private Long user1Id;

    @Column(name = "user2_id")
    private Long user2Id;

    @Column(name = "name", length = 200)
    private String name;

    @Column(name = "problem_id")
    private Long problemId;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    

    public ChatRooms() {
		super();
	}

	public ChatRooms(Long id, String roomType, Long user1Id, Long user2Id, String name, Long problemId,
			Long createdByUserId, OffsetDateTime createdAt) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.user1Id = user1Id;
		this.user2Id = user2Id;
		this.name = name;
		this.problemId = problemId;
		this.createdByUserId = createdByUserId;
		this.createdAt = createdAt;
	}

	// -------- getters & setters --------

    public Long getId() {
        return id;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

	@Override
	public String toString() {
		return "ChatRooms [id=" + id + ", roomType=" + roomType + ", user1Id=" + user1Id + ", user2Id=" + user2Id
				+ ", name=" + name + ", problemId=" + problemId + ", createdByUserId=" + createdByUserId
				+ ", createdAt=" + createdAt + "]";
	}
    
}

