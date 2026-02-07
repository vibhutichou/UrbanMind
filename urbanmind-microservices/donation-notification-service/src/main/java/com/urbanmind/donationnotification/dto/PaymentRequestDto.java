package com.urbanmind.donationnotification.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentRequestDto {
    
    @NotBlank(message = "Gateway payment ID is required")
    private String gatewayPaymentId;
    
    private String gatewaySignature;
    private String paymentMethod;
    
    // Constructors
    public PaymentRequestDto() {}
    
    // Getters and Setters
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
}
