package com.backend.backend.dto;

import com.backend.backend.entity.StatutEvaluation;
import lombok.Data;

@Data
public class EvaluationRequest {

    private Long stageId;

    private Double note;

    private String appreciation;

    private StatutEvaluation statut;
}