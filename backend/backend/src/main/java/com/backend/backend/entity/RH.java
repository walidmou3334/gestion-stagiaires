package com.backend.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rh")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RH {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String matricule;

    private String service;

    @OneToOne
    @JoinColumn(name = "compte_id", nullable = false, unique = true)
    private Compte compte;
}