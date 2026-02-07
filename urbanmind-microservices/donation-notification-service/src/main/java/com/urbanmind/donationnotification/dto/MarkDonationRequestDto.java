package com.urbanmind.donationnotification.dto;

import java.math.BigDecimal;

public class MarkDonationRequestDto {
    private Boolean donationRequired;
    private BigDecimal requiredAmount;

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
}

