package com.urbanmind.urbanmind_auth.entity;

import java.time.OffsetDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "problem_media")
public class ProblemMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "media_type")
    private String mediaType;

    @Column(name = "media_url", nullable = false)
    private String mediaUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public Long getId() { return id; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
