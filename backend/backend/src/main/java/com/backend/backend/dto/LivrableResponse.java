package com.backend.backend.dto;

import com.backend.backend.entity.StatutLivrable;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LivrableResponse {

    private Long id;

    private String titre;
    private String description;

    private String fichier;
    private String nomOriginal;

    private LocalDateTime dateDepot;

    private StatutLivrable statut;

    private String remarque;

    private Long stageId;
    private String sujetFinal;

    private String nomCandidat;
    private String prenomCandidat;

    private String nomEncadrant;
    private String prenomEncadrant;

    private String downloadUrl;
}