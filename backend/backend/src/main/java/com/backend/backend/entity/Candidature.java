package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "candidature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateCandidature;

    private String domaineStage;

    private String sujetPropose;

    private String cvFichier;
    private String cvNomOriginal;

    private String autresDocuments;

    @Enumerated(EnumType.STRING)
    private StatutCandidature statut;

    @ManyToOne
    @JoinColumn(name = "candidat_id")
    @JsonIgnoreProperties({"compte"})
    private Candidat candidat;
}