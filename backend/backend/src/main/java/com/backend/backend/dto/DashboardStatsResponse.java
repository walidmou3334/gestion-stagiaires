package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {

    private long totalCandidatures;
    private long candidaturesEnAttente;
    private long candidaturesAcceptees;
    private long candidaturesRefusees;

    private long totalEntretiens;
    private long entretiensPlanifies;
    private long entretiensTermines;
    private long entretiensAnnules;

    private long totalStages;
    private long stagesEnCours;
    private long stagesTermines;
    private long stagesAnnules;

    private long totalLivrables;
    private long livrablesEnAttente;
    private long livrablesValides;
    private long livrablesRejetes;

    private long totalEvaluations;
    private long evaluationsValidees;
    private long evaluationsNonValidees;
}