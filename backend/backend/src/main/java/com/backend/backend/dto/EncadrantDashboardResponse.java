package com.backend.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EncadrantDashboardResponse {

    private long mesStages;
    private long stagesEnCours;
    private long stagesTermines;

    private long livrablesRecus;
    private long livrablesEnAttente;
    private long livrablesValides;
    private long livrablesRejetes;

    private long evaluationsRealisees;
}