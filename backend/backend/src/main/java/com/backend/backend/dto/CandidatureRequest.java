package com.backend.backend.dto;

import lombok.Data;

@Data
public class CandidatureRequest {
    private String domaineStage;
    private String sujetPropose;
    private String cvFichier;
    private String autresDocuments;
}