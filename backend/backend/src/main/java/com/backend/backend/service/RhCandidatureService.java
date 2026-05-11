package com.backend.backend.service;

import com.backend.backend.dto.CandidatureResponse;
import com.backend.backend.entity.Candidature;
import com.backend.backend.entity.StatutCandidature;
import com.backend.backend.repository.CandidatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RhCandidatureService {

    private final CandidatureRepository candidatureRepository;

    public List<CandidatureResponse> getAllCandidatures() {
        return candidatureRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CandidatureResponse accepterCandidature(Long id) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        candidature.setStatut(StatutCandidature.ACCEPTEE);
        return mapToResponse(candidatureRepository.save(candidature));
    }

    public CandidatureResponse refuserCandidature(Long id) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        candidature.setStatut(StatutCandidature.REFUSEE);
        return mapToResponse(candidatureRepository.save(candidature));
    }

    private CandidatureResponse mapToResponse(Candidature c) {
        return CandidatureResponse.builder()
                .id(c.getId())
                .dateCandidature(c.getDateCandidature())
                .domaineStage(c.getDomaineStage())
                .sujetPropose(c.getSujetPropose())
                .cvFichier(c.getCvFichier())
                .cvNomOriginal(c.getCvNomOriginal())
                .autresDocuments(c.getAutresDocuments())
                .statut(c.getStatut())
                .cvDownloadUrl("/api/candidatures/" + c.getId() + "/download-cv")
                .autresDocumentDownloadUrl(
                        c.getAutresDocuments() != null
                                ? "/api/candidatures/" + c.getId() + "/download-autre"
                                : null
                )
                .build();
    }
}