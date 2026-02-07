package cdac.project.urbanmind.dto;

public class UserDTO {
    public Long id;
    public String fullName;
    public String email;
    public String phone;
    public ProfileRole role;
    public String city;
    public String state;
    public String addressLine;
    public String country;
    public String pincode;
    public String username;
    public String profilePhotoUrl;
    public java.time.OffsetDateTime createdAt;    
    public java.time.OffsetDateTime lastLoginAt;
    public String verificationStatus;
    
    // Leaderboard/Stats fields
    public Integer level;
    public Double ratingAverage;
    public Integer ratingCount;
    public Integer problemsSolvedCount;

}
