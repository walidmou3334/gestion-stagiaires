package com.backend.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StageAffectationRequest {

    private Long candidatureId;

    private Long encadrantId;

    private String sujetFinal;

    private String service;

    private LocalDate dateDebut;

    private LocalDate dateFin;
}