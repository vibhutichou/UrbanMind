package com.urbanmind.donationnotification.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "problems", schema = "urbanmind")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_by_user_id", nullable = false)
    private Long createdByUserId;

    @Column(name = "assigned_to_user_id")
    private Long assignedToUserId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 30)
    private String status = "OPEN";

    // --- Donation Fields from your SQL & Request ---

    @Column(name = "is_donation_enabled", nullable = false)
    private Boolean isDonationEnabled = false;

    @Column(name = "target_amount", precision = 12, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "amount_raised", nullable = false, precision = 12, scale = 2)
    private BigDecimal amountRaised = BigDecimal.ZERO;

    // From your recent ALTER request:
    @Column(name = "donation_required")
    private Boolean donationRequired = false;

    @Column(name = "required_amount", precision = 12, scale = 2)
    private BigDecimal requiredAmount;

    // --- Audit Fields ---

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Default Constructor
    public Problem() {
    }

    // Getters and Setters (Standard Boilerplate)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getDonationRequired() {
        return donationRequired;
    }

    public void setDonationRequired(Boolean donationRequired) {
        this.donationRequired = donationRequired;
    }

    public BigDecimal getRequiredAmount() {
        return requiredAmount;
    }

    public void setRequiredAmount(BigDecimal requiredAmount) {
        this.requiredAmount = requiredAmount;
    }

    public BigDecimal getAmountRaised() {
        return amountRaised;
    }

    public void setAmountRaised(BigDecimal amountRaised) {
        this.amountRaised = amountRaised;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Long getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(Long assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsDonationEnabled() {
        return isDonationEnabled;
    }

    public void setIsDonationEnabled(Boolean isDonationEnabled) {
        this.isDonationEnabled = isDonationEnabled;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

}
