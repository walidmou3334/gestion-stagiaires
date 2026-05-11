package com.backend.backend.dto;

import com.backend.backend.entity.StatutStage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class StageAffectationResponse {

    private Long id;

    private String sujetFinal;

    private String service;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private StatutStage statut;

    private Long candidatureId;

    private String domaineStage;

    private String sujetPropose;

    private String nomCandidat;

    private String prenomCandidat;

    private Long encadrantId;

    private String nomEncadrant;

    private String prenomEncadrant;

    private String emailEncadrant;

    private String serviceEncadrant;

    private String specialiteEncadrant;
}