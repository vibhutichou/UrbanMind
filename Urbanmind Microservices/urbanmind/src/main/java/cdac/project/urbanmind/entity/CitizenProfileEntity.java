package cdac.project.urbanmind.entity;

import java.time.OffsetDateTime;

import cdac.project.urbanmind.dto.VerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "citizen_profile", schema = "urbanmind")
public class CitizenProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private Integer level;

    @Column(name = "report_count")
    private Integer reportCount;

    @Column(name = "problems_solved_count")
    private Integer problemsSolvedCount;
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;
	
    private String verificationDocUrl;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime verifiedAt;
    public VerificationStatus getVerificationStatus() {
		return verificationStatus;
	}
	public void setVerificationStatus(VerificationStatus verificationStatus) {
		this.verificationStatus = verificationStatus;
	}
	
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
	public Integer getReportCount() {
		return reportCount;
	}
	public void setReportCount(Integer reportCount) {
		this.reportCount = reportCount;
	}
	public Integer getProblemsSolvedCount() {
		return problemsSolvedCount;
	}
	public void setProblemsSolvedCount(Integer problemsSolvedCount) {
		this.problemsSolvedCount = problemsSolvedCount;
	}
	
	public String getVerificationDocUrl() {
		return verificationDocUrl;
	}
	public void setVerificationDocUrl(String verificationDocUrl) {
		this.verificationDocUrl = verificationDocUrl;
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
	public OffsetDateTime getVerifiedAt() {
		return verifiedAt;
	}
	public void setVerifiedAt(OffsetDateTime verifiedAt) {
		this.verifiedAt = verifiedAt;
	}

   
}
