package cdac.project.urbanmind.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

import cdac.project.urbanmind.dto.VerificationStatus;

@Entity
@Table(name = "volunteer_profile", schema = "urbanmind")
public class VolunteerProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // ================= BASIC =================
    private Integer level;

    private String skills;
    private String availability;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Column(name = "has_vehicle")
    private Boolean hasVehicle;

    // ================= VERIFICATION =================
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "verification_doc_url")
    private String verificationDocUrl;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    // ================= RATING =================
    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "rating_count")
    private Integer ratingCount;

    // ================= STATS =================
    @Column(name = "problems_solved_count")
    private Integer problemsSolvedCount;

    // ================= AUDIT =================
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Boolean getHasVehicle() {
        return hasVehicle;
    }

    public void setHasVehicle(Boolean hasVehicle) {
        this.hasVehicle = hasVehicle;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationDocUrl() {
        return verificationDocUrl;
    }

    public void setVerificationDocUrl(String verificationDocUrl) {
        this.verificationDocUrl = verificationDocUrl;
    }

    public OffsetDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(OffsetDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public Double getRatingAverage() {
        return ratingAverage;
    }

    public void setRatingAverage(Double ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public Integer getProblemsSolvedCount() {
        return problemsSolvedCount;
    }

    public void setProblemsSolvedCount(Integer problemsSolvedCount) {
        this.problemsSolvedCount = problemsSolvedCount;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
