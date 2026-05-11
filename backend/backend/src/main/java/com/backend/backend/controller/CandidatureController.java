package com.backend.backend.controller;

import com.backend.backend.dto.CandidatureResponse;
import com.backend.backend.entity.Candidature;
import com.backend.backend.entity.Compte;
import com.backend.backend.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class CandidatureController {

    private final CandidatureService service;

    @PostMapping(consumes = "multipart/form-data")
    public CandidatureResponse create(
            @RequestParam String domaineStage,
            @RequestParam String sujetPropose,
            @RequestParam MultipartFile cvFile,
            @RequestParam(required = false) MultipartFile autresFile,
            Authentication auth
    ) {
        return service.createCandidature(
                auth.getName(),
                domaineStage,
                sujetPropose,
                cvFile,
                autresFile
        );
    }

    @GetMapping("/me")
    public List<CandidatureResponse> my(Authentication auth) {
        return service.getMyCandidatures(auth.getName());
    }

    @GetMapping("/{id}/download-cv")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long id, Authentication auth) {

        Candidature candidature = service.getCandidatureById(id);

        Resource resource = service.loadCvFile(candidature);

        String fileName = candidature.getCvNomOriginal();

        if (fileName == null || fileName.isBlank()) {
            fileName = "cv.pdf";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }}