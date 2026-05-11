package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidatDashboardResponse {

    private long mesCandidatures;
    private long candidaturesEnAttente;
    private long candidaturesAcceptees;
    private long candidaturesRefusees;

    private long mesEntretiens;
    private long mesStages;
    private long mesLivrables;
    private long livrablesEnAttente;
    private long livrablesValides;
    private long livrablesRejetes;

    private long mesEvaluations;
}