package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
    private String niveauEtude;
    private String domaine;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "compte_id", nullable = false, unique = true)
    private Compte compte;
}
