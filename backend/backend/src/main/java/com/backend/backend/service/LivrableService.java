package com.backend.backend.service;

import com.backend.backend.dto.LivrableResponse;
import com.backend.backend.dto.ValidationLivrableRequest;
import com.backend.backend.entity.*;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LivrableService {

    private final LivrableRepository livrableRepository;
    private final StageAffectationRepository stageRepository;
    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;
    private final EncadrantRepository encadrantRepository;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public LivrableResponse deposerLivrable(
            String username,
            Long stageId,
            String titre,
            String description,
            MultipartFile file
    ) {
        try {
            Compte compte = compteRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Compte introuvable"));

            Candidat candidat = candidatRepository.findByCompte(compte)
                    .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

            StageAffectation stage = stageRepository.findById(stageId)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));

            if (!stage.getCandidature().getCandidat().getId().equals(candidat.getId())) {
                throw new AccessDeniedException("Ce stage ne vous appartient pas");
            }

            if (file == null || file.isEmpty()) {
                throw new RuntimeException("Le fichier est obligatoire");
            }

            validateFile(file);

            Path uploadPath = Paths.get(uploadDir, "livrables")
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();
            String savedName = saveFile(file, uploadPath);

            Livrable livrable = Livrable.builder()
                    .titre(titre)
                    .description(description)
                    .fichier(savedName)
                    .nomOriginal(originalName)
                    .dateDepot(LocalDateTime.now())
                    .statut(StatutLivrable.EN_ATTENTE)
                    .remarque(null)
                    .stage(stage)
                    .build();

            return mapToResponse(livrableRepository.save(livrable));

        } catch (IOException e) {
            throw new RuntimeException("Erreur fichier : " + e.getMessage());
        }
    }

    public List<LivrableResponse> getMesLivrables(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        return livrableRepository
                .findByStage_Candidature_Candidat_Id(candidat.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<LivrableResponse> getAllLivrables() {
        return livrableRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<LivrableResponse> getLivrablesEncadrant(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Encadrant encadrant = encadrantRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        return livrableRepository.findByStage_Encadrant_Id(encadrant.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public LivrableResponse validerLivrable(Long id, ValidationLivrableRequest request) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable"));

        livrable.setStatut(StatutLivrable.VALIDE);
        livrable.setRemarque(request.getRemarque());

        return mapToResponse(livrableRepository.save(livrable));
    }

    public LivrableResponse rejeterLivrable(Long id, ValidationLivrableRequest request) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable"));

        livrable.setStatut(StatutLivrable.REJETE);
        livrable.setRemarque(request.getRemarque());

        return mapToResponse(livrableRepository.save(livrable));
    }

    public Resource downloadLivrable(Long id) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable"));

        return loadFile(livrable.getFichier());
    }

    public Livrable getLivrableEntity(Long id) {
        return livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable introuvable"));
    }

    private String saveFile(MultipartFile file, Path uploadPath) throws IOException {
        String original = file.getOriginalFilename();
        String extension = "";

        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf("."));
        }

        String newName = UUID.randomUUID() + extension;

        Files.copy(
                file.getInputStream(),
                uploadPath.resolve(newName),
                StandardCopyOption.REPLACE_EXISTING
        );

        return newName;
    }

    private Resource loadFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, "livrables")
                    .toAbsolutePath()
                    .normalize()
                    .resolve(fileName)
                    .normalize();

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Fichier introuvable ou illisible");
            }

            return resource;

        } catch (Exception e) {
            throw new RuntimeException("Erreur téléchargement : " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.contains(".")) {
            throw new RuntimeException("Nom de fichier invalide");
        }

        String extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

        List<String> allowed = List.of(".pdf", ".doc", ".docx", ".zip");

        if (!allowed.contains(extension)) {
            throw new RuntimeException("Type de fichier non autorisé : " + extension);
        }
    }

    private LivrableResponse mapToResponse(Livrable l) {
        StageAffectation stage = l.getStage();
        Candidature candidature = stage.getCandidature();
        Candidat candidat = candidature.getCandidat();
        Encadrant encadrant = stage.getEncadrant();

        return LivrableResponse.builder()
                .id(l.getId())
                .titre(l.getTitre())
                .description(l.getDescription())
                .fichier(l.getFichier())
                .nomOriginal(l.getNomOriginal())
                .dateDepot(l.getDateDepot())
                .statut(l.getStatut())
                .remarque(l.getRemarque())
                .stageId(stage.getId())
                .sujetFinal(stage.getSujetFinal())
                .nomCandidat(candidat != null ? candidat.getNom() : null)
                .prenomCandidat(candidat != null ? candidat.getPrenom() : null)
                .nomEncadrant(encadrant != null ? encadrant.getNom() : null)
                .prenomEncadrant(encadrant != null ? encadrant.getPrenom() : null)
                .downloadUrl("/api/livrables/" + l.getId() + "/download")
                .build();
    }
}