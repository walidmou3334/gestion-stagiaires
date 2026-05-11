package com.backend.backend.service;

import com.backend.backend.dto.EntretienRequest;
import com.backend.backend.dto.EntretienResponse;
import com.backend.backend.entity.*;
import com.backend.backend.repository.CandidatRepository;
import com.backend.backend.repository.CandidatureRepository;
import com.backend.backend.repository.CompteRepository;
import com.backend.backend.repository.EntretienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntretienService {

    private final EntretienRepository entretienRepository;
    private final CandidatureRepository candidatureRepository;
    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;

    public EntretienResponse planifierEntretien(EntretienRequest request) {
        Candidature candidature = candidatureRepository.findById(request.getCandidatureId())
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        if (candidature.getStatut() != StatutCandidature.ACCEPTEE) {
            throw new RuntimeException("La candidature doit être acceptée avant de planifier un entretien");
        }

        if (entretienRepository.findByCandidature(candidature).isPresent()) {
            throw new RuntimeException("Un entretien existe déjà pour cette candidature");
        }

        Entretien entretien = Entretien.builder()
                .dateEntretien(request.getDateEntretien())
                .heureEntretien(request.getHeureEntretien())
                .lieu(request.getLieu())
                .commentaire(request.getCommentaire())
                .statut(StatutEntretien.PLANIFIE)
                .candidature(candidature)
                .build();

        return mapToResponse(entretienRepository.save(entretien));
    }

    public List<EntretienResponse> getAllEntretiens() {
        return entretienRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EntretienResponse terminerEntretien(Long id) {
        Entretien entretien = entretienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        entretien.setStatut(StatutEntretien.TERMINE);

        return mapToResponse(entretienRepository.save(entretien));
    }

    public EntretienResponse annulerEntretien(Long id) {
        Entretien entretien = entretienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entretien introuvable"));

        entretien.setStatut(StatutEntretien.ANNULE);

        return mapToResponse(entretienRepository.save(entretien));
    }

    public List<EntretienResponse> getMesEntretiens(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        return entretienRepository.findByCandidature_Candidat_Id(candidat.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private EntretienResponse mapToResponse(Entretien e) {
        Candidature c = e.getCandidature();
        Candidat candidat = c.getCandidat();

        return EntretienResponse.builder()
                .id(e.getId())
                .dateEntretien(e.getDateEntretien())
                .heureEntretien(e.getHeureEntretien())
                .lieu(e.getLieu())
                .commentaire(e.getCommentaire())
                .statut(e.getStatut())
                .candidatureId(c.getId())
                .domaineStage(c.getDomaineStage())
                .sujetPropose(c.getSujetPropose())
                .nomCandidat(candidat != null ? candidat.getNom() : null)
                .prenomCandidat(candidat != null ? candidat.getPrenom() : null)
                .build();
    }
}