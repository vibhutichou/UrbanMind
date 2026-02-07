package com.urbanmind.urbanmind_auth.service.impl;

import java.time.OffsetDateTime;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urbanmind.urbanmind_auth.entity.ProblemMedia;
import com.urbanmind.urbanmind_auth.repository.ProblemMediaRepository;
import com.urbanmind.urbanmind_auth.service.ProblemMediaService;

@Service
@Transactional
public class ProblemMediaServiceImpl implements ProblemMediaService {

    private final ProblemMediaRepository mediaRepository;

    public ProblemMediaServiceImpl(ProblemMediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public ProblemMedia addMedia(Long problemId, MultipartFile file, Long userId) {

        // 1. Ensure uploads directory exists
        String uploadDir = "uploads/";
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }

        // 2. Generate unique filename
        String originalFilename = file.getOriginalFilename();

     // ✅ sanitize filename
     String safeFilename = originalFilename
             .replaceAll("\\s+", "_")
             .replaceAll("[^a-zA-Z0-9._-]", "");

     String uniqueFilename = UUID.randomUUID() + "_" + safeFilename;

     Path filePath = Paths.get("uploads", uniqueFilename);

     try {
         Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
     } catch (IOException e) {
         throw new RuntimeException("Could not store file", e);
     }

   


        // 4. Create Entity
        ProblemMedia media = new ProblemMedia();
        media.setProblemId(problemId);
        media.setCreatedByUserId(userId);
        media.setCreatedAt(OffsetDateTime.now());

        // Assuming you serve static files from root or /uploads
        // We will configure a WebMvcConfig to serve /uploads request path from local uploads/ dir
        media.setMediaUrl("/uploads/" + uniqueFilename);
        
        String mimeType = file.getContentType();
        media.setContentType(mimeType);
        
        // Determine simple media type for the varchar(20) column
        if (mimeType != null && mimeType.startsWith("image/")) {
            media.setMediaType("IMAGE");
        } else if (mimeType != null && mimeType.startsWith("video/")) {
            media.setMediaType("VIDEO");
        } else {
            media.setMediaType("FILE");
        }

        media.setFileSizeBytes(file.getSize());
        media.setThumbnailUrl(null); // Optional: generate thumbnail later

        return mediaRepository.save(media);
    }

    @Override
    public List<ProblemMedia> getMediaByProblem(Long problemId) {
        return mediaRepository.findByProblemIdOrderByCreatedAtAsc(problemId);
    }
}
