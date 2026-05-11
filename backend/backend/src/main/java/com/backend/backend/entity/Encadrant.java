package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="encadrant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encadrant {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique=true)
    private String matricule;

    private String email;
    private String telephone;

    private String specialite;
    private String service;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name="compte_id",nullable=false,unique=true)
    private Compte compte;
}