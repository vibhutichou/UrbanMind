package cdac.project.urbanmind.services;

import java.time.OffsetDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cdac.project.urbanmind.dto.ProfileRole;
import cdac.project.urbanmind.dto.VerificationStatus;
import cdac.project.urbanmind.entity.CitizenProfileEntity;
import cdac.project.urbanmind.entity.NgoProfileEntity;
import cdac.project.urbanmind.entity.VolunteerProfileEntity;
import cdac.project.urbanmind.exceptions.ResourceNotFoundException;
import cdac.project.urbanmind.repository.CitizenProfileRepository;
import cdac.project.urbanmind.repository.NgoProfileRepository;
import cdac.project.urbanmind.repository.VolunteerProfileRepository;
import cdac.project.urbanmind.repository.UserRepository;
import cdac.project.urbanmind.dto.UserDTO;
import cdac.project.urbanmind.dto.ProfileResponseDTO;
import cdac.project.urbanmind.entity.UserEntity;


@Service
public class ProfileServiceImpl implements ProfileService {

    private final CitizenProfileRepository citizenRepo;
    private final NgoProfileRepository ngoRepo;
    private final VolunteerProfileRepository volunteerRepo;
    private final UserRepository userRepo;
    private final jakarta.persistence.EntityManager entityManager;

    public ProfileServiceImpl(
            CitizenProfileRepository citizenRepo,
            NgoProfileRepository ngoRepo,
            VolunteerProfileRepository volunteerRepo,
            UserRepository userRepo,
            jakarta.persistence.EntityManager entityManager) {

        this.citizenRepo = citizenRepo;
        this.ngoRepo = ngoRepo;
        this.volunteerRepo = volunteerRepo;
        this.userRepo = userRepo;
        this.entityManager = entityManager;
    }

    // =================================================
    // GET PROFILE
    // =================================================
    @Override
    @Transactional
    public Object getProfile(ProfileRole role, Long userId) {

        UserEntity userEntity = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        UserDTO userDTO = new UserDTO();
        userDTO.id = userEntity.getId();
        userDTO.fullName = userEntity.getFullName();
        userDTO.email = userEntity.getEmail();
        userDTO.phone = userEntity.getPhone();
        userDTO.role = ProfileRole.valueOf(userEntity.getPrimaryRole());
        userDTO.city = userEntity.getCity();
        userDTO.state = userEntity.getState();
        userDTO.addressLine = userEntity.getAddressLine();
        userDTO.country = userEntity.getCountry();
        userDTO.pincode = userEntity.getPincode();
        userDTO.username = userEntity.getUsername();
        userDTO.profilePhotoUrl = userEntity.getProfilePhotoUrl();
        userDTO.createdAt = userEntity.getCreatedAt();
        userDTO.lastLoginAt = userEntity.getLastLoginAt();

        Object profileEntity = null;

        if (role == ProfileRole.CITIZEN) {
            profileEntity = citizenRepo.findByUserId(userId).orElseGet(() -> {
                CitizenProfileEntity newProfile = new CitizenProfileEntity();
                newProfile.setUserId(userId);
                newProfile.setVerificationStatus(VerificationStatus.PENDING);
                newProfile.setLevel(0);
                newProfile.setReportCount(0);
                newProfile.setProblemsSolvedCount(0);
                newProfile.setCreatedAt(java.time.OffsetDateTime.now());
                newProfile.setUpdatedAt(java.time.OffsetDateTime.now());
                try {
                    return citizenRepo.save(newProfile);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to create Citizen profile: " + e.getMessage());
                }
            });
        } else if (role == ProfileRole.NGO) {
            profileEntity = ngoRepo.findByUserId(userId).orElseGet(() -> {
                NgoProfileEntity newProfile = new NgoProfileEntity();
                newProfile.setUserId(userId);
                newProfile.setVerificationStatus(VerificationStatus.PENDING);
                newProfile.setOrganizationName(
                    userEntity.getFullName() != null && !userEntity.getFullName().isEmpty() 
                    ? userEntity.getFullName() 
                    : "NGO Organization"
                ); 
                // Using timestamp to ensure uniqueness strictly
                String uniqueSuffix = userId + "-" + System.currentTimeMillis();
                newProfile.setRegistrationNumber("PENDING-" + uniqueSuffix); 
                newProfile.setRegistrationAuthority("PENDING"); 
                newProfile.setPanNumber("PENDING-" + uniqueSuffix);
                newProfile.setContactPersonName(userEntity.getFullName() != null ? userEntity.getFullName() : "Contact Person");
                newProfile.setContactPersonPhone(userEntity.getPhone() != null ? userEntity.getPhone() : "");
                newProfile.setContactPersonEmail(userEntity.getEmail() != null ? userEntity.getEmail() : "");
                newProfile.setAddressLine(userEntity.getAddressLine() != null ? userEntity.getAddressLine() : "");
                newProfile.setCity(userEntity.getCity() != null ? userEntity.getCity() : "");
                newProfile.setState(userEntity.getState() != null ? userEntity.getState() : "");
                newProfile.setCountry(userEntity.getCountry() != null ? userEntity.getCountry() : "");
                newProfile.setPincode(userEntity.getPincode() != null ? userEntity.getPincode() : "");
                newProfile.setWebsiteUrl("");
                
                newProfile.setTotalDonationsReceived(0.0);
                newProfile.setProblemsSolvedCount(0);
                newProfile.setRatingAverage(0.0);
                newProfile.setRatingCount(0);
                newProfile.setIsGovtVerified(false);
                newProfile.setCreatedAt(java.time.OffsetDateTime.now());
                newProfile.setUpdatedAt(java.time.OffsetDateTime.now());
                try {
                    return ngoRepo.save(newProfile);
                } catch (Exception e) {
                    // Log the error to console for debugging
                    System.err.println("Error saving NGO Profile: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Failed to create NGO profile: " + e.getMessage());
                }
            });
        } else if (role == ProfileRole.VOLUNTEER) {
            profileEntity = volunteerRepo.findByUserId(userId).orElseGet(() -> {
                VolunteerProfileEntity newProfile = new VolunteerProfileEntity();
                newProfile.setUserId(userId);
                newProfile.setVerificationStatus(VerificationStatus.PENDING);
                newProfile.setLevel(0);
                newProfile.setProblemsSolvedCount(0);
                newProfile.setRatingAverage(0.0);
                newProfile.setRatingCount(0);
                newProfile.setHasVehicle(false);
                newProfile.setCreatedAt(java.time.OffsetDateTime.now());
                newProfile.setUpdatedAt(java.time.OffsetDateTime.now());
                return volunteerRepo.save(newProfile);
            });
        } else if (role == ProfileRole.ADMIN) {
             // Admin doesn't have a separate profile table yet.
             profileEntity = null;
        } else {
            throw new RuntimeException("Invalid role");
        }

        ProfileResponseDTO response = new ProfileResponseDTO();
        response.user = userDTO;
        response.profile = profileEntity;

        return response;
    }

    // =================================================
    // UPDATE PROFILE
    // =================================================
    @Override
    public Object updateProfile(ProfileRole role, Long userId, Map<String, Object> body) {
        System.out.println("Updating profile for userId: " + userId + ", role: " + role);
        System.out.println("Request Body Keys: " + body.keySet());
        
        // 1. Update User Entity (Common Fields)
        UserEntity userEntity = userRepo.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean userUpdated = false;
        if (body.containsKey("fullName") && body.get("fullName") != null) {
            userEntity.setFullName(body.get("fullName").toString());
            userUpdated = true;
        }
        if (body.containsKey("email") && body.get("email") != null) {
            userEntity.setEmail(body.get("email").toString());
            userUpdated = true;
        }
        if (body.containsKey("phone") && body.get("phone") != null) {
            userEntity.setPhone(body.get("phone").toString());
            userUpdated = true;
        }
        if (body.containsKey("city") && body.get("city") != null) {
            userEntity.setCity(body.get("city").toString());
            userUpdated = true;
        }
        if (body.containsKey("state") && body.get("state") != null) {
            userEntity.setState(body.get("state").toString());
            userUpdated = true;
        }
        if (body.containsKey("country") && body.get("country") != null) {
            userEntity.setCountry(body.get("country").toString());
            userUpdated = true;
        }
        if (body.containsKey("pincode") && body.get("pincode") != null) {
            userEntity.setPincode(body.get("pincode").toString());
            userUpdated = true;
        }
        if (body.containsKey("addressLine") && body.get("addressLine") != null) {
            userEntity.setAddressLine(body.get("addressLine").toString());
            userUpdated = true;
        }
         if (body.containsKey("profilePhotoUrl") && body.get("profilePhotoUrl") != null) {
            userEntity.setProfilePhotoUrl(body.get("profilePhotoUrl").toString());
            userUpdated = true;
        }
        
        if (userUpdated) {
            userEntity.setUpdatedAt(java.time.OffsetDateTime.now());
            userRepo.save(userEntity);
        }

        // 2. Update Role Specific Profile
        Object updatedProfileEntity = null;

        // ---------- CITIZEN ----------
        if (role == ProfileRole.CITIZEN) {
            CitizenProfileEntity c =
                    citizenRepo.findByUserId(userId).orElseThrow();

            if (body.containsKey("level"))
                c.setLevel((Integer) body.get("level"));

            if (body.containsKey("reportCount"))
                c.setReportCount((Integer) body.get("reportCount"));

            if (body.containsKey("problemsSolvedCount"))
                c.setProblemsSolvedCount(
                        (Integer) body.get("problemsSolvedCount"));

            if (body.containsKey("verificationStatus"))
                c.setVerificationStatus(
                        VerificationStatus.valueOf(
                                body.get("verificationStatus").toString()));

            if (body.containsKey("verificationDocUrl"))
                c.setVerificationDocUrl(
                        body.get("verificationDocUrl").toString());

            if (body.containsKey("verifiedAt"))
                c.setVerifiedAt(
                        OffsetDateTime.parse(body.get("verifiedAt").toString()));

            c.setUpdatedAt(OffsetDateTime.now());
            updatedProfileEntity = citizenRepo.save(c);

             // Sync with UserEntity
            if (body.containsKey("verificationStatus")) {
                userEntity.setKycStatus(body.get("verificationStatus").toString());
                userRepo.save(userEntity);
            }
        }

        // ---------- NGO ----------
        if (role == ProfileRole.NGO) {
            NgoProfileEntity ngo =
                    ngoRepo.findByUserId(userId).orElseThrow();

            if (body.containsKey("organizationName") && body.get("organizationName") != null)
                ngo.setOrganizationName(body.get("organizationName").toString());

            if (body.containsKey("registrationNumber") && body.get("registrationNumber") != null)
                ngo.setRegistrationNumber(body.get("registrationNumber").toString());

            if (body.containsKey("registrationAuthority") && body.get("registrationAuthority") != null)
                ngo.setRegistrationAuthority(body.get("registrationAuthority").toString());

            if (body.containsKey("panNumber") && body.get("panNumber") != null)
                ngo.setPanNumber(body.get("panNumber").toString());

            if (body.containsKey("contactPersonName") && body.get("contactPersonName") != null)
                ngo.setContactPersonName(body.get("contactPersonName").toString());

            if (body.containsKey("contactPersonPhone") && body.get("contactPersonPhone") != null)
                ngo.setContactPersonPhone(body.get("contactPersonPhone").toString());

            if (body.containsKey("contactPersonEmail") && body.get("contactPersonEmail") != null)
                ngo.setContactPersonEmail(body.get("contactPersonEmail").toString());

            if (body.containsKey("websiteUrl") && body.get("websiteUrl") != null)
                ngo.setWebsiteUrl(body.get("websiteUrl").toString());

            if (body.containsKey("addressLine") && body.get("addressLine") != null)
                ngo.setAddressLine(body.get("addressLine").toString());

            if (body.containsKey("city") && body.get("city") != null)
                ngo.setCity(body.get("city").toString());

            if (body.containsKey("state") && body.get("state") != null)
                ngo.setState(body.get("state").toString());

            if (body.containsKey("country") && body.get("country") != null)
                ngo.setCountry(body.get("country").toString());

            if (body.containsKey("pincode") && body.get("pincode") != null)
                ngo.setPincode(body.get("pincode").toString());

            if (body.containsKey("verificationStatus") && body.get("verificationStatus") != null)
                ngo.setVerificationStatus(
                        VerificationStatus.valueOf(
                                body.get("verificationStatus").toString()));

            if (body.containsKey("verificationDocUrl") && body.get("verificationDocUrl") != null)
                ngo.setVerificationDocUrl(
                        body.get("verificationDocUrl").toString());

            if (body.containsKey("verifiedAt") && body.get("verifiedAt") != null)
                ngo.setVerifiedAt(
                        OffsetDateTime.parse(body.get("verifiedAt").toString()));

            if (body.containsKey("isGovtVerified") && body.get("isGovtVerified") != null)
                ngo.setIsGovtVerified(
                        Boolean.valueOf(body.get("isGovtVerified").toString()));

            if (body.containsKey("totalDonationsReceived") && body.get("totalDonationsReceived") != null)
                ngo.setTotalDonationsReceived(
                        Double.valueOf(
                                body.get("totalDonationsReceived").toString()));

            if (body.containsKey("ratingAverage") && body.get("ratingAverage") != null)
                ngo.setRatingAverage(
                        Double.valueOf(body.get("ratingAverage").toString()));

            if (body.containsKey("ratingCount") && body.get("ratingCount") != null)
                ngo.setRatingCount(
                        Integer.valueOf(body.get("ratingCount").toString()));

            ngo.setUpdatedAt(OffsetDateTime.now());
            updatedProfileEntity = ngoRepo.save(ngo);

            // Sync with UserEntity
            if (body.containsKey("verificationStatus")) {
                userEntity.setKycStatus(body.get("verificationStatus").toString());
                userRepo.save(userEntity);
            }

        }

        // ---------- VOLUNTEER ----------
        if (role == ProfileRole.VOLUNTEER) {
            VolunteerProfileEntity v =
                    volunteerRepo.findByUserId(userId).orElseThrow();

            if (body.containsKey("level"))
                v.setLevel((Integer) body.get("level"));

            if (body.containsKey("skills"))
                v.setSkills(body.get("skills").toString());

            if (body.containsKey("availability"))
                v.setAvailability(body.get("availability").toString());

            if (body.containsKey("hasVehicle"))
                v.setHasVehicle((Boolean) body.get("hasVehicle"));

            if (body.containsKey("vehicleNumber"))
                v.setVehicleNumber(body.get("vehicleNumber").toString());

            if (body.containsKey("verificationStatus"))
                v.setVerificationStatus(
                        VerificationStatus.valueOf(
                                body.get("verificationStatus").toString()));

            if (body.containsKey("verificationDocUrl"))
                v.setVerificationDocUrl(
                        body.get("verificationDocUrl").toString());

            if (body.containsKey("verifiedAt"))
                v.setVerifiedAt(
                        OffsetDateTime.parse(body.get("verifiedAt").toString()));

            if (body.containsKey("ratingAverage"))
                v.setRatingAverage(
                        Double.valueOf(body.get("ratingAverage").toString()));

            if (body.containsKey("ratingCount"))
                v.setRatingCount(
                        Integer.valueOf(body.get("ratingCount").toString()));

            v.setUpdatedAt(OffsetDateTime.now());
            updatedProfileEntity = volunteerRepo.save(v);

            // Sync with UserEntity
            if (body.containsKey("verificationStatus")) {
                userEntity.setKycStatus(body.get("verificationStatus").toString());
                userRepo.save(userEntity);
            }

        }

        // Return composite response
        if (role != ProfileRole.ADMIN && updatedProfileEntity == null) {
             throw new RuntimeException("Invalid role or profile not found");
        }
        
        UserDTO userDTO = new UserDTO();
        userDTO.id = userEntity.getId();
        userDTO.fullName = userEntity.getFullName();
        userDTO.email = userEntity.getEmail();
        userDTO.phone = userEntity.getPhone();
        userDTO.role = ProfileRole.valueOf(userEntity.getPrimaryRole());
        userDTO.city = userEntity.getCity();
        userDTO.state = userEntity.getState();
        userDTO.addressLine = userEntity.getAddressLine();
        userDTO.country = userEntity.getCountry();
        userDTO.pincode = userEntity.getPincode();
        userDTO.username = userEntity.getUsername();
        userDTO.profilePhotoUrl = userEntity.getProfilePhotoUrl();

        ProfileResponseDTO response = new ProfileResponseDTO();
        response.user = userDTO;
        // For Admin, profile is null, which is expected
        response.profile = updatedProfileEntity;
        
        return response;

    }

    // =================================================
    // DELETE PROFILE
    // =================================================
    @Override
    @Transactional
    public void deleteProfile(ProfileRole role, Long userId) {

        if (role == ProfileRole.ADMIN) {
            throw new RuntimeException("Admin profile cannot be deleted.");
        }

        // 1. Delete ALL potential profiles for this user to ensure clean state
        // (Even if role is NGO, we check others just in case of data inconsistency)
        citizenRepo.findByUserId(userId).ifPresent(citizenRepo::delete);
        ngoRepo.findByUserId(userId).ifPresent(ngoRepo::delete);
        volunteerRepo.findByUserId(userId).ifPresent(volunteerRepo::delete);

        // Delete Password Reset Tokens (Foreign Key Constraint Fix)
        try {
            entityManager.createNativeQuery("DELETE FROM urbanmind.password_reset_tokens WHERE user_id = :userId")
                    .setParameter("userId", userId)
                    .executeUpdate();
        } catch (Exception e) {
            // Ignore if table doesn't exist or other minor issues, fallback will catch major ones
            System.out.println("Warning: Could not delete password reset tokens: " + e.getMessage());
        }

        // 2. Delete Main User Account
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        try {
            userRepo.delete(user);
            userRepo.flush(); // Force execution to catch constraints immediately
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // 3. Fallback: Soft Delete if Hard Delete is blocked by constraints (e.g. Reports, Posts)
            user.setStatus("DELETED");
            user.setFullName("Deleted User");
            // Ensure unique email/username for soft-deleted users
            user.setEmail("deleted_" + userId + "_" + System.currentTimeMillis() + "@urbanmind.deleted");
            user.setPhone(null);
            user.setUsername("deleted_" + userId + "_" + System.currentTimeMillis());
            user.setProfilePhotoUrl(null);
            user.setPassword(""); // Clear password credentials
            userRepo.save(user);
        }
    }

    @Override
    public java.util.List<UserDTO> getAllProfiles(String roleFilter) {
        java.util.List<UserEntity> users;
        if (roleFilter == null || roleFilter.trim().isEmpty() || roleFilter.equalsIgnoreCase("all")) {
            users = userRepo.findAll();
        } else {
            try {
                // Handle case-insensitive role matching
                ProfileRole role = ProfileRole.valueOf(roleFilter.toUpperCase());
                users = userRepo.findByPrimaryRole(role.name());
            } catch (IllegalArgumentException e) {
                // If role is invalid, return empty list or all users? 
                // Returning empty list is safer to avoid leaking data if filter was intended
                return new java.util.ArrayList<>();
            }
        }
        return users.stream().map(this::mapUserToDTO).collect(java.util.stream.Collectors.toList());
    }

    private UserDTO mapUserToDTO(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        userDTO.id = userEntity.getId();
        userDTO.fullName = userEntity.getFullName();
        userDTO.email = userEntity.getEmail();
        userDTO.phone = userEntity.getPhone();
        userDTO.role = ProfileRole.valueOf(userEntity.getPrimaryRole());
        userDTO.city = userEntity.getCity();
        userDTO.state = userEntity.getState();
        userDTO.addressLine = userEntity.getAddressLine();
        userDTO.country = userEntity.getCountry();
        userDTO.pincode = userEntity.getPincode();
        userDTO.username = userEntity.getUsername();
        userDTO.profilePhotoUrl = userEntity.getProfilePhotoUrl();
        userDTO.createdAt = userEntity.getCreatedAt();
        userDTO.lastLoginAt = userEntity.getLastLoginAt();
        
        // Fetch verification status and stats based on role
        try {
            Long uid = userEntity.getId();
            ProfileRole r = ProfileRole.valueOf(userEntity.getPrimaryRole());
            if (r == ProfileRole.CITIZEN) {
                citizenRepo.findByUserId(uid).ifPresent(p -> {
                    userDTO.verificationStatus = p.getVerificationStatus().name();
                    userDTO.level = p.getLevel();
                    userDTO.problemsSolvedCount = p.getProblemsSolvedCount();
                });
            } else if (r == ProfileRole.NGO) {
                ngoRepo.findByUserId(uid).ifPresent(p -> {
                    userDTO.verificationStatus = p.getVerificationStatus().name();
                    userDTO.ratingAverage = p.getRatingAverage();
                    userDTO.ratingCount = p.getRatingCount();
                    userDTO.problemsSolvedCount = p.getProblemsSolvedCount();
                });
            } else if (r == ProfileRole.VOLUNTEER) {
                volunteerRepo.findByUserId(uid).ifPresent(p -> {
                    userDTO.verificationStatus = p.getVerificationStatus().name();
                    userDTO.level = p.getLevel();
                    userDTO.ratingAverage = p.getRatingAverage();
                    userDTO.ratingCount = p.getRatingCount();
                    userDTO.problemsSolvedCount = p.getProblemsSolvedCount();
                });
            }
        } catch (Exception e) {
            userDTO.verificationStatus = "UNKNOWN";
        }
        
        return userDTO;
    }

    @Override
    public Object getPublicProfile(Long userId) {
        UserEntity userEntity = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Use the generic getProfile method which handles profile creation/retrieval logic
        return getProfile(ProfileRole.valueOf(userEntity.getPrimaryRole()), userId);
    }
}
