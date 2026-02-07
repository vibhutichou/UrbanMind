package com.urbanmind.urbanmind_auth.entity;


import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Short: Entity storing automatic/manual classification results for a Problem
@Entity
@Table(name = "problem_classification")
public class ProblemClassification {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Linked problem id
    private Long problemId;
    // Computed categories
    private String mainCategory;
    private String subCategory;
    // AI model outputs
    private BigDecimal aiSeverityScore;
    private String aiModelVersion;
    // Manual override support
    private Boolean isManualOverride;
    private String manualSeverity;
    private String manualCategory;
    // Last updated timestamp
    private OffsetDateTime updatedAt;
    
 // getters and setters
    
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getProblemId() {
		return problemId;
	}
	public void setProblemId(Long problemId) {
		this.problemId = problemId;
	}
	public String getMainCategory() {
		return mainCategory;
	}
	public void setMainCategory(String mainCategory) {
		this.mainCategory = mainCategory;
	}
	public String getSubCategory() {
		return subCategory;
	}
	public void setSubCategory(String subCategory) {
		this.subCategory = subCategory;
	}
	public BigDecimal getAiSeverityScore() {
		return aiSeverityScore;
	}
	public void setAiSeverityScore(BigDecimal aiSeverityScore) {
		this.aiSeverityScore = aiSeverityScore;
	}
	public String getAiModelVersion() {
		return aiModelVersion;
	}
	public void setAiModelVersion(String aiModelVersion) {
		this.aiModelVersion = aiModelVersion;
	}
	public Boolean getIsManualOverride() {
		return isManualOverride;
	}
	public void setIsManualOverride(Boolean isManualOverride) {
		this.isManualOverride = isManualOverride;
	}
	public String getManualSeverity() {
		return manualSeverity;
	}
	public void setManualSeverity(String manualSeverity) {
		this.manualSeverity = manualSeverity;
	}
	public String getManualCategory() {
		return manualCategory;
	}
	public void setManualCategory(String manualCategory) {
		this.manualCategory = manualCategory;
	}
	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(OffsetDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
    
}
