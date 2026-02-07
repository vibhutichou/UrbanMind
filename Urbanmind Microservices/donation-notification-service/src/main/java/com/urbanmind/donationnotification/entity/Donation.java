package com.urbanmind.donationnotification.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
@Entity
@Table(name = "donations", schema = "urbanmind")
public class Donation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "problem_id", nullable = false)
    private Long problemId;
    
    @Column(name = "donor_user_id", nullable = false)
    private Long donorUserId;
    
    @Column(name = "receiver_user_id", nullable = false)
    private Long receiverUserId;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, length = 10)
    private String currency = "INR";
    
    @Column(name = "payment_gateway", nullable = false, length = 30)
    private String paymentGateway;
    
    @Column(nullable = false, length = 30)
    private String status;
    
    @Column(name = "gateway_order_id", nullable = false, length = 100)
    private String gatewayOrderId;
    
    @Column(name = "gateway_payment_id", length = 100)
    private String gatewayPaymentId;
    
    @Column(name = "gateway_signature", length = 255)
    private String gatewaySignature;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "failure_reason", length = 255)
    private String failureReason;
    
    @Column(name = "last_gateway_event", length = 100)
    private String lastGatewayEvent;
    
    @Column(name = "last_raw_payload", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String lastRawPayload;
    
    @Column(name = "last_event_received_at")
    private OffsetDateTime lastEventReceivedAt;
    
    @Column(name = "last_error_message", length = 255)
    private String lastErrorMessage;
    
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
    
    @Column(name = "paid_at")
    private OffsetDateTime paidAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
    
    // Constructors
    public Donation() {}
    
    // Getters and Setters
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
    
    public Long getDonorUserId() {
        return donorUserId;
    }
    
    public void setDonorUserId(Long donorUserId) {
        this.donorUserId = donorUserId;
    }
    
    public Long getReceiverUserId() {
        return receiverUserId;
    }
    
    public void setReceiverUserId(Long receiverUserId) {
        this.receiverUserId = receiverUserId;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getPaymentGateway() {
        return paymentGateway;
    }
    
    public void setPaymentGateway(String paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getGatewayOrderId() {
        return gatewayOrderId;
    }
    
    public void setGatewayOrderId(String gatewayOrderId) {
        this.gatewayOrderId = gatewayOrderId;
    }
    
    public String getGatewayPaymentId() {
        return gatewayPaymentId;
    }
    
    public void setGatewayPaymentId(String gatewayPaymentId) {
        this.gatewayPaymentId = gatewayPaymentId;
    }
    
    public String getGatewaySignature() {
        return gatewaySignature;
    }
    
    public void setGatewaySignature(String gatewaySignature) {
        this.gatewaySignature = gatewaySignature;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public String getLastGatewayEvent() {
        return lastGatewayEvent;
    }
    
    public void setLastGatewayEvent(String lastGatewayEvent) {
        this.lastGatewayEvent = lastGatewayEvent;
    }
    
    public String getLastRawPayload() {
        return lastRawPayload;
    }
    
    public void setLastRawPayload(String lastRawPayload) {
        this.lastRawPayload = lastRawPayload;
    }
    
    public OffsetDateTime getLastEventReceivedAt() {
        return lastEventReceivedAt;
    }
    
    public void setLastEventReceivedAt(OffsetDateTime lastEventReceivedAt) {
        this.lastEventReceivedAt = lastEventReceivedAt;
    }
    
    public String getLastErrorMessage() {
        return lastErrorMessage;
    }
    
    public void setLastErrorMessage(String lastErrorMessage) {
        this.lastErrorMessage = lastErrorMessage;
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
    
    public OffsetDateTime getPaidAt() {
        return paidAt;
    }
    
    public void setPaidAt(OffsetDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
