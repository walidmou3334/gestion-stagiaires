package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double note;

    @Column(length = 1000)
    private String appreciation;

    private LocalDateTime dateEvaluation;

    @Enumerated(EnumType.STRING)
    private StatutEvaluation statut;

    @OneToOne
    @JoinColumn(name = "stage_id", nullable = false, unique = true)
    private StageAffectation stage;
}