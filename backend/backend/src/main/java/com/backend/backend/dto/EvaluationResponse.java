package com.backend.backend.dto;

import com.backend.backend.entity.StatutEvaluation;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EvaluationResponse {

    private Long id;

    private Double note;

    private String appreciation;

    private LocalDateTime dateEvaluation;

    private StatutEvaluation statut;

    private Long stageId;

    private String sujetFinal;

    private String service;

    private String nomCandidat;

    private String prenomCandidat;

    private String nomEncadrant;

    private String prenomEncadrant;
}