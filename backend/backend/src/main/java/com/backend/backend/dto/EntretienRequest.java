package com.backend.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EntretienRequest {

    private Long candidatureId;

    private LocalDate dateEntretien;

    private LocalTime heureEntretien;

    private String lieu;

    private String commentaire;
}