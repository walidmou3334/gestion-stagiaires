package com.backend.backend.dto;

import com.backend.backend.entity.StatutCandidature;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CandidatureResponse {

    private Long id;
    private LocalDate dateCandidature;
    private String domaineStage;
    private String sujetPropose;
    private String cvFichier;
    private String cvNomOriginal;
    private String autresDocuments;
    private StatutCandidature statut;

    private String cvDownloadUrl;
    private String autresDocumentDownloadUrl;
}