package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "livrable")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livrable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(length = 1000)
    private String description;

    private String fichier;

    private String nomOriginal;

    private LocalDateTime dateDepot;

    @Enumerated(EnumType.STRING)
    private StatutLivrable statut;

    @Column(length = 1000)
    private String remarque;

    @ManyToOne
    @JoinColumn(name = "stage_id", nullable = false)
    private StageAffectation stage;
}