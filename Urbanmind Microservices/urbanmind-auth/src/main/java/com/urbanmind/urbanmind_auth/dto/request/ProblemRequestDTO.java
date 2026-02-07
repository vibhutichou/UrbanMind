package com.urbanmind.urbanmind_auth.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;

// Short: DTO used to create/update a Problem; holds details, location and optional donation info
public class ProblemRequestDTO {

    // Short: brief title, required
    @NotBlank
    private String title;

    // Short: detailed description, required
    @NotBlank
    private String description;

    // Optional classification fields (may be auto-classified)
    private String category;
    private String severity;
    private String tags;

    // Address components (optional)
    private String addressLine;
    private String city;
    private String state;
    private String country;
    private String pincode;
    
    // Location is not strictly required during creation if frontend says optional
    private BigDecimal latitude;
    
    private BigDecimal longitude;
    
    // Optional flags
    private Boolean isAnonymous;
    private Boolean isDonationEnabled;
    private BigDecimal targetAmount;

    // Update fields
    private Integer progress;
    private Integer teamCount;
    private BigDecimal amountSpent; // Maps to amountRaised
    private String status;

    public Integer getProgress() {
        return progress;
    }
    public void setProgress(Integer progress) {
        this.progress = progress;
    }
    public Integer getTeamCount() {
        return teamCount;
    }
    public void setTeamCount(Integer teamCount) {
        this.teamCount = teamCount;
    }
    public BigDecimal getAmountSpent() {
        return amountSpent;
    }
    public void setAmountSpent(BigDecimal amountSpent) {
        this.amountSpent = amountSpent;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    
 // getters and setters
    
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
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public String getTags() {
		return tags;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}
	public String getAddressLine() {
		return addressLine;
	}
	public void setAddressLine(String addressLine) {
		this.addressLine = addressLine;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
	public BigDecimal getLatitude() {
		return latitude;
	}
	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}
	public BigDecimal getLongitude() {
		return longitude;
	}
	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}
	public Boolean getIsAnonymous() {
		return isAnonymous;
	}
	public void setIsAnonymous(Boolean isAnonymous) {
		this.isAnonymous = isAnonymous;
	}
	public Boolean getIsDonationEnabled() {
		return isDonationEnabled;
	}
	public void setIsDonationEnabled(Boolean isDonationEnabled) {
		this.isDonationEnabled = isDonationEnabled;
	}
	public BigDecimal getTargetAmount() {
		return targetAmount;
	}
	public void setTargetAmount(BigDecimal targetAmount) {
		this.targetAmount = targetAmount;
	}

}