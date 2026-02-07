package cdac.project.urbanmind.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cdac.project.urbanmind.dto.ProfileRole;
import cdac.project.urbanmind.services.ProfileService;


@RestController
@RequestMapping("/api/profiles")

public class ProfileController {

    private final ProfileService service;
   

    public ProfileController(ProfileService service) {
        this.service = service;
        
    }

    
    @GetMapping("/{role}/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<?> getProfile(
            @PathVariable ProfileRole role,
            @PathVariable Long userId) {
    	System.out.println();
        return ResponseEntity.ok(service.getProfile(role, userId));
        
    }

    @PutMapping("/{role}/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<?> updateProfile(
            @PathVariable ProfileRole role,
            @PathVariable Long userId,
            @RequestBody Map<String, Object> body) {

        return ResponseEntity.ok(service.updateProfile(role, userId, body));
    }
    

    @DeleteMapping("/{role}/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<?> deleteProfile(
            @PathVariable ProfileRole role,
            @PathVariable Long userId) {

        service.deleteProfile(role, userId);
        return ResponseEntity.ok("Deleted successfully");
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllProfiles(@org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "all") String role) {
        return ResponseEntity.ok(service.getAllProfiles(role));
    }
    
//
//    @PostMapping("/team/add")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<TeamMemberEntity> addTeamMember(@RequestBody TeamMemberEntity teamMember) {
//        return ResponseEntity.ok(teamMemberService.addTeamMember(teamMember));
//    }

    @GetMapping("/public/{userId}")
    public ResponseEntity<?> getPublicProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getPublicProfile(userId));
    }
    
}