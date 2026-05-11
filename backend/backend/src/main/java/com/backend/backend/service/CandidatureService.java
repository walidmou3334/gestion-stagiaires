package com.backend.backend.service;

import com.backend.backend.dto.CandidatureResponse;
import com.backend.backend.entity.*;
import com.backend.backend.repository.CandidatRepository;
import com.backend.backend.repository.CandidatureRepository;
import com.backend.backend.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final CandidatRepository candidatRepository;
    private final CompteRepository compteRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public CandidatureResponse createCandidature(
            String username,
            String domaineStage,
            String sujetPropose,
            MultipartFile cvFile,
            MultipartFile autresFile
    ) {
        try {
            Compte compte = compteRepository.findByUsername(username)
                    .orElseThrow();

            Candidat candidat = candidatRepository.findByCompte(compte)
                    .orElseThrow();

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(uploadPath);

            String cvOriginalName = cvFile.getOriginalFilename();
            String cvName = saveFile(cvFile, uploadPath);

            String autresName = autresFile != null && !autresFile.isEmpty()
                    ? saveFile(autresFile, uploadPath)
                    : null;

            Candidature c = Candidature.builder()
                    .dateCandidature(LocalDate.now())
                    .domaineStage(domaineStage)
                    .sujetPropose(sujetPropose)
                    .cvFichier(cvName)
                    .cvNomOriginal(cvOriginalName)
                    .autresDocuments(autresName)
                    .statut(StatutCandidature.EN_ATTENTE)
                    .candidat(candidat)
                    .build();

            return mapToResponse(candidatureRepository.save(c));

        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }

    }

    private String saveFile(MultipartFile file, Path path) throws IOException {
        String ext = file.getOriginalFilename()
                .substring(file.getOriginalFilename().lastIndexOf("."));

        String name = UUID.randomUUID() + ext;

        Files.copy(file.getInputStream(), path.resolve(name), StandardCopyOption.REPLACE_EXISTING);

        return name;
    }

    public List<CandidatureResponse> getMyCandidatures(String username) {
        Compte compte = compteRepository.findByUsername(username).orElseThrow();
        Candidat candidat = candidatRepository.findByCompte(compte).orElseThrow();

        return candidatureRepository.findByCandidat(candidat)
                .stream().map(this::mapToResponse).toList();
    }

    public Resource downloadCv(String username, Long id) {
        Candidature c = getMyCandidature(id, username);
        return loadFile(c.getCvFichier());
    }

    private Resource loadFile(String fileName) {
        try {
            Path path = Paths.get(uploadDir).resolve(fileName);
            return new UrlResource(path.toUri());
        } catch (Exception e) {
            throw new RuntimeException("Erreur fichier");
        }
    }

    private Candidature getMyCandidature(Long id, String username) {
        Compte compte = compteRepository.findByUsername(username).orElseThrow();
        Candidat candidat = candidatRepository.findByCompte(compte).orElseThrow();

        Candidature c = candidatureRepository.findById(id).orElseThrow();

        if (!c.getCandidat().getId().equals(candidat.getId())) {
            throw new AccessDeniedException("Forbidden");
        }

        return c;
    }

    private CandidatureResponse mapToResponse(Candidature c) {
        return CandidatureResponse.builder()
                .id(c.getId())
                .dateCandidature(c.getDateCandidature())
                .domaineStage(c.getDomaineStage())
                .sujetPropose(c.getSujetPropose())
                .cvFichier(c.getCvFichier())
                .autresDocuments(c.getAutresDocuments())
                .statut(c.getStatut())
                .cvDownloadUrl("/api/candidatures/" + c.getId() + "/download-cv")
                .build();
    }
    public Candidature getMyCandidatureById(Long id, String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        if (!candidature.getCandidat().getId().equals(candidat.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Accès interdit");
        }

        return candidature;
    }
    public Candidature getCandidatureById(Long id) {
        return candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));
    }
    public Resource loadCvFile(Candidature candidature) {
        return loadFile(candidature.getCvFichier());
    }
}