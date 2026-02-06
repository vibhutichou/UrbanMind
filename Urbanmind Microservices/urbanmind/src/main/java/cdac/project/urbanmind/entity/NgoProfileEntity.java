package cdac.project.urbanmind.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

import cdac.project.urbanmind.dto.VerificationStatus;

@Entity
@Table(name = "ngo_profile", schema = "urbanmind")
public class NgoProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // ========== BASIC ==========
    @Column(name = "organization_name")
    private String organizationName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "registration_authority")
    private String registrationAuthority;

    @Column(name = "pan_number")
    private String panNumber;

    // ========== CONTACT ==========
    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "contact_person_phone")
    private String contactPersonPhone;

    @Column(name = "contact_person_email")
    private String contactPersonEmail;

    // ========== ADDRESS ==========
    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "address_line")
    private String addressLine;

    private String city;
    private String state;
    private String country;
    private String pincode;

    // ========== VERIFICATION ==========
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "verification_doc_url")
    private String verificationDocUrl;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(name = "is_govt_verified")
    private Boolean isGovtVerified;

    // ========== STATS ==========
    @Column(name = "total_donations_received")
    private Double totalDonationsReceived;

    @Column(name = "problems_solved_count")
    private Integer problemsSolvedCount;

    @Column(name = "rating_average")
    private Double ratingAverage;

    @Column(name = "rating_count")
    private Integer ratingCount;

    // ========== AUDIT ==========
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

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

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getRegistrationNumber() {
		return registrationNumber;
	}

	public void setRegistrationNumber(String registrationNumber) {
		this.registrationNumber = registrationNumber;
	}

	public String getRegistrationAuthority() {
		return registrationAuthority;
	}

	public void setRegistrationAuthority(String registrationAuthority) {
		this.registrationAuthority = registrationAuthority;
	}

	public String getPanNumber() {
		return panNumber;
	}

	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}

	public String getContactPersonName() {
		return contactPersonName;
	}

	public void setContactPersonName(String contactPersonName) {
		this.contactPersonName = contactPersonName;
	}

	public String getContactPersonPhone() {
		return contactPersonPhone;
	}

	public void setContactPersonPhone(String contactPersonPhone) {
		this.contactPersonPhone = contactPersonPhone;
	}

	public String getContactPersonEmail() {
		return contactPersonEmail;
	}

	public void setContactPersonEmail(String contactPersonEmail) {
		this.contactPersonEmail = contactPersonEmail;
	}

	public String getWebsiteUrl() {
		return websiteUrl;
	}

	public void setWebsiteUrl(String websiteUrl) {
		this.websiteUrl = websiteUrl;
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

	public Boolean getIsGovtVerified() {
		return isGovtVerified;
	}

	public void setIsGovtVerified(Boolean isGovtVerified) {
		this.isGovtVerified = isGovtVerified;
	}

	public Double getTotalDonationsReceived() {
		return totalDonationsReceived;
	}

	public void setTotalDonationsReceived(Double totalDonationsReceived) {
		this.totalDonationsReceived = totalDonationsReceived;
	}

	public Integer getProblemsSolvedCount() {
		return problemsSolvedCount;
	}

	public void setProblemsSolvedCount(Integer problemsSolvedCount) {
		this.problemsSolvedCount = problemsSolvedCount;
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
