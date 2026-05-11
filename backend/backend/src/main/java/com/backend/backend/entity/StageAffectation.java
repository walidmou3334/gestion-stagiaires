package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "stage_affectation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StageAffectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujetFinal;

    private String service;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private StatutStage statut;

    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"candidat"})
    private Candidature candidature;

    @ManyToOne
    @JoinColumn(name = "encadrant_id", nullable = false)
    private Encadrant encadrant;
}