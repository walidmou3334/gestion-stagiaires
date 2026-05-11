package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.*;
import com.backend.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CandidatureRepository candidatureRepository;
    private final EntretienRepository entretienRepository;
    private final StageAffectationRepository stageRepository;
    private final LivrableRepository livrableRepository;
    private final EvaluationRepository evaluationRepository;

    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;
    private final EncadrantRepository encadrantRepository;

    public DashboardStatsResponse getRhDashboard() {
        var candidatures = candidatureRepository.findAll();
        var entretiens = entretienRepository.findAll();
        var stages = stageRepository.findAll();
        var livrables = livrableRepository.findAll();
        var evaluations = evaluationRepository.findAll();

        return DashboardStatsResponse.builder()

                .totalCandidatures(candidatures.size())
                .candidaturesEnAttente(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                                .count()
                )
                .candidaturesAcceptees(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.ACCEPTEE)
                                .count()
                )
                .candidaturesRefusees(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.REFUSEE)
                                .count()
                )

                .totalEntretiens(entretiens.size())
                .entretiensPlanifies(
                        entretiens.stream()
                                .filter(e -> e.getStatut() == StatutEntretien.PLANIFIE)
                                .count()
                )
                .entretiensTermines(
                        entretiens.stream()
                                .filter(e -> e.getStatut() == StatutEntretien.TERMINE)
                                .count()
                )
                .entretiensAnnules(
                        entretiens.stream()
                                .filter(e -> e.getStatut() == StatutEntretien.ANNULE)
                                .count()
                )

                .totalStages(stages.size())
                .stagesEnCours(
                        stages.stream()
                                .filter(s -> s.getStatut() == StatutStage.EN_COURS)
                                .count()
                )
                .stagesTermines(
                        stages.stream()
                                .filter(s -> s.getStatut() == StatutStage.TERMINE)
                                .count()
                )
                .stagesAnnules(
                        stages.stream()
                                .filter(s -> s.getStatut() == StatutStage.ANNULE)
                                .count()
                )

                .totalLivrables(livrables.size())
                .livrablesEnAttente(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.EN_ATTENTE)
                                .count()
                )
                .livrablesValides(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.VALIDE)
                                .count()
                )
                .livrablesRejetes(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.REJETE)
                                .count()
                )

                .totalEvaluations(evaluations.size())
                .evaluationsValidees(
                        evaluations.stream()
                                .filter(e -> e.getStatut() == StatutEvaluation.VALIDE)
                                .count()
                )
                .evaluationsNonValidees(
                        evaluations.stream()
                                .filter(e -> e.getStatut() == StatutEvaluation.NON_VALIDE)
                                .count()
                )

                .build();
    }

    public CandidatDashboardResponse getCandidatDashboard(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Candidat candidat = candidatRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        var candidatures = candidatureRepository.findByCandidat(candidat);
        var entretiens = entretienRepository.findByCandidature_Candidat_Id(candidat.getId());
        var stages = stageRepository.findByCandidature_Candidat_Id(candidat.getId());
        var livrables = livrableRepository.findByStage_Candidature_Candidat_Id(candidat.getId());
        var evaluations = evaluationRepository.findByStage_Candidature_Candidat_Id(candidat.getId());

        return CandidatDashboardResponse.builder()
                .mesCandidatures(candidatures.size())
                .candidaturesEnAttente(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.EN_ATTENTE)
                                .count()
                )
                .candidaturesAcceptees(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.ACCEPTEE)
                                .count()
                )
                .candidaturesRefusees(
                        candidatures.stream()
                                .filter(c -> c.getStatut() == StatutCandidature.REFUSEE)
                                .count()
                )
                .mesEntretiens(entretiens.size())
                .mesStages(stages.size())
                .mesLivrables(livrables.size())
                .livrablesEnAttente(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.EN_ATTENTE)
                                .count()
                )
                .livrablesValides(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.VALIDE)
                                .count()
                )
                .livrablesRejetes(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.REJETE)
                                .count()
                )
                .mesEvaluations(evaluations.size())
                .build();
    }

    public EncadrantDashboardResponse getEncadrantDashboard(String username) {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Encadrant encadrant = encadrantRepository.findByCompte(compte)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        var stages = stageRepository.findAll()
                .stream()
                .filter(s -> s.getEncadrant().getId().equals(encadrant.getId()))
                .toList();

        var livrables = livrableRepository.findByStage_Encadrant_Id(encadrant.getId());
        var evaluations = evaluationRepository.findByStage_Encadrant_Id(encadrant.getId());

        return EncadrantDashboardResponse.builder()
                .mesStages(stages.size())
                .stagesEnCours(
                        stages.stream()
                                .filter(s -> s.getStatut() == StatutStage.EN_COURS)
                                .count()
                )
                .stagesTermines(
                        stages.stream()
                                .filter(s -> s.getStatut() == StatutStage.TERMINE)
                                .count()
                )
                .livrablesRecus(livrables.size())
                .livrablesEnAttente(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.EN_ATTENTE)
                                .count()
                )
                .livrablesValides(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.VALIDE)
                                .count()
                )
                .livrablesRejetes(
                        livrables.stream()
                                .filter(l -> l.getStatut() == StatutLivrable.REJETE)
                                .count()
                )
                .evaluationsRealisees(evaluations.size())
                .build();
    }
}