package com.urbanmind.donationnotification.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class DonationRequestDto {
    
    @NotNull(message = "Problem ID is required")
    private Long problemId;
    
    @NotNull(message = "Donor User ID is required")
    private Long donorUserId;
    
    @NotNull(message = "Receiver User ID is required")
    private Long receiverUserId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least 1")
    private BigDecimal amount;
    
    @NotBlank(message = "Payment gateway is required")
    @Size(max = 30)
    private String paymentGateway;
    
    // Constructors
    public DonationRequestDto() {}
    
    // Getters and Setters
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
    
    public String getPaymentGateway() {
        return paymentGateway;
    }
    
    public void setPaymentGateway(String paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}
