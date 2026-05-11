package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "entretien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entretien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateEntretien;

    private LocalTime heureEntretien;

    private String lieu;

    private String commentaire;

    @Enumerated(EnumType.STRING)
    private StatutEntretien statut;

    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"candidat"})
    private Candidature candidature;
}