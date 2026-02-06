package cdac.project.urbanmind.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import cdac.project.urbanmind.controllers.ProfileController;
import cdac.project.urbanmind.dto.ProfileRole;
import cdac.project.urbanmind.entity.NgoProfileEntity;
import cdac.project.urbanmind.services.ProfileService;


@WebMvcTest(ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
	@MockBean
    private ProfileService service;

    // ================= GET NGO =================
    @Test
    void getNgoProfile_apiTest() throws Exception {

        NgoProfileEntity ngo = new NgoProfileEntity();
        ngo.setUserId(1L);

        when(service.getProfile(ProfileRole.NGO, 1L))
                .thenReturn(ngo);

        mockMvc.perform(
                get("/api/v1/profiles/NGO/1")
                        .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());
    }

    // ================= UPDATE NGO =================
    @SuppressWarnings("unchecked")
	@Test
    void updateNgoProfile_apiTest() throws Exception {

        NgoProfileEntity ngo = new NgoProfileEntity();
        ngo.setUserId(1L);

        when(service.updateProfile(
                eq(ProfileRole.NGO),
                eq(1L),
                any(Map.class)
        )).thenReturn(ngo);

        mockMvc.perform(
                put("/api/v1/profiles/NGO/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"websiteUrl\": \"https://ngo.org\" }")
        )
        .andExpect(status().isOk());
    }

    // ================= DELETE NGO =================
    @Test
    void deleteProfile_apiTest() throws Exception {

        doNothing().when(service)
                .deleteProfile(ProfileRole.NGO, 1L);

        mockMvc.perform(
                delete("/api/v1/profiles/NGO/1")
        )
        .andExpect(status().isOk());
    }
}
