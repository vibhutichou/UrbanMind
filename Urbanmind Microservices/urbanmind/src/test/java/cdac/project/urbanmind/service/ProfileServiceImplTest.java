
package cdac.project.urbanmind.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import cdac.project.urbanmind.dto.ProfileRole;
import cdac.project.urbanmind.entity.NgoProfileEntity;
import cdac.project.urbanmind.repository.CitizenProfileRepository;
import cdac.project.urbanmind.repository.NgoProfileRepository;
import cdac.project.urbanmind.repository.VolunteerProfileRepository;
import cdac.project.urbanmind.services.ProfileServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

    @Mock
    private CitizenProfileRepository citizenRepo;

    @Mock
    private NgoProfileRepository ngoRepo;

    @Mock
    private VolunteerProfileRepository volunteerRepo;

    @InjectMocks
    private ProfileServiceImpl service;

    // ---------- GET NGO PROFILE ----------
    @Test
    void getNgoProfile_success() {

        NgoProfileEntity ngo = new NgoProfileEntity();
        ngo.setUserId(1L);
        ngo.setOrganizationName("Helping Hands");

        when(ngoRepo.findByUserId(1L)).thenReturn(Optional.of(ngo));

        Object result = service.getProfile(ProfileRole.NGO, 1L);

        assertNotNull(result);
        assertTrue(result instanceof NgoProfileEntity);
        assertEquals("Helping Hands",
                ((NgoProfileEntity) result).getOrganizationName());
    }

    // ---------- UPDATE NGO PROFILE ----------
    @Test
    void updateNgoProfile_success() {

        NgoProfileEntity ngo = new NgoProfileEntity();
        ngo.setUserId(1L);

        when(ngoRepo.findByUserId(1L)).thenReturn(Optional.of(ngo));
        when(ngoRepo.save(any())).thenReturn(ngo);

        Map<String, Object> body =
                Map.of("websiteUrl", "https://ngo.org");

        Object result =
                service.updateProfile(ProfileRole.NGO, 1L, body);

        assertNotNull(result);
        verify(ngoRepo).save(ngo);
    }

    // ---------- DELETE VOLUNTEER ----------
    @Test
    void deleteVolunteer_success() {

        when(volunteerRepo.findByUserId(5L))
                .thenReturn(Optional.empty());

        service.deleteProfile(ProfileRole.VOLUNTEER, 5L);

        verify(volunteerRepo).findByUserId(5L);
    }
}
