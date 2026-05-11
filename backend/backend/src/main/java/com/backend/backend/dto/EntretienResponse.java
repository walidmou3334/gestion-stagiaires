package com.backend.backend.dto;

import com.backend.backend.entity.StatutEntretien;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class EntretienResponse {

    private Long id;

    private LocalDate dateEntretien;

    private LocalTime heureEntretien;

    private String lieu;

    private String commentaire;

    private StatutEntretien statut;

    private Long candidatureId;

    private String domaineStage;

    private String sujetPropose;

    private String nomCandidat;

    private String prenomCandidat;
}