package com.backend.backend.controller;

import com.backend.backend.dto.LivrableResponse;
import com.backend.backend.entity.Livrable;
import com.backend.backend.service.LivrableService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/livrables")
@RequiredArgsConstructor
public class LivrableController {

    private final LivrableService livrableService;

    @PostMapping(consumes = "multipart/form-data")
    public LivrableResponse deposer(
            @RequestParam Long stageId,
            @RequestParam String titre,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile file,
            Authentication authentication
    ) {
        return livrableService.deposerLivrable(
                authentication.getName(),
                stageId,
                titre,
                description,
                file
        );
    }

    @GetMapping("/me")
    public List<LivrableResponse> mesLivrables(Authentication authentication) {
        return livrableService.getMesLivrables(authentication.getName());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Livrable livrable = livrableService.getLivrableEntity(id);
        Resource resource = livrableService.downloadLivrable(id);

        String fileName = livrable.getNomOriginal();

        if (fileName == null || fileName.isBlank()) {
            fileName = "livrable.pdf";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .body(resource);
    }
}