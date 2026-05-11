package com.backend.backend.dto;

import com.backend.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String motDePasse;

    @NotNull
    private Role role;

    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
    private String niveauEtude;
    private String domaine;

    private String matricule;
    private String service;
    private String specialite;
}