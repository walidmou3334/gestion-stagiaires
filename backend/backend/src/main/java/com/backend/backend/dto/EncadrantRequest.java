package com.backend.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncadrantRequest {

    private String nom;
    private String prenom;
    private String matricule;
    private String email;
    private String telephone;
    private String specialite;
    private String service;

    // compte login
    private String username;
    private String motDePasse;
}