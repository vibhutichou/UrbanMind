package com.urbanmind.donationnotification.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class DonationResponseDto {
    
    private Long id;
    private Long problemId;
    private Long donorUserId;
    private Long receiverUserId;
    private BigDecimal amount;
    private String currency;
    private String paymentGateway;
    private String status;
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private String paymentMethod;
    private OffsetDateTime createdAt;
    private OffsetDateTime paidAt;
    
    // Constructors
    public DonationResponseDto() {}
    
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
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public OffsetDateTime getPaidAt() {
        return paidAt;
    }
    
    public void setPaidAt(OffsetDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
