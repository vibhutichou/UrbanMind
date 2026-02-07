package cdac.project.urbanmind.services;

import java.util.Map;

import cdac.project.urbanmind.dto.ProfileRole;

public interface ProfileService {

	

	    Object getProfile(ProfileRole role, Long userId);

	    Object updateProfile(ProfileRole role, Long userId, Map<String, Object> body);

	    void deleteProfile(ProfileRole role, Long userId);

    java.util.List<cdac.project.urbanmind.dto.UserDTO> getAllProfiles(String roleFilter);
    
    Object getPublicProfile(Long userId);
}


