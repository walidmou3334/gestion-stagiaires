package com.backend.backend.service;

import com.backend.backend.dto.*;
import com.backend.backend.entity.*;
import com.backend.backend.repository.*;
import com.backend.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;
    private final RHRepository rhRepository;
    private final EncadrantRepository encadrantRepository;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (compteRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username déjà utilisé");
        }

        if (compteRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Compte compte = Compte.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .actif(true)
                .build();

        compte = compteRepository.save(compte);

        switch (request.getRole()) {
            case CANDIDAT -> {
                Candidat candidat = Candidat.builder()
                        .nom(request.getNom())
                        .prenom(request.getPrenom())
                        .telephone(request.getTelephone())
                        .adresse(request.getAdresse())
                        .niveauEtude(request.getNiveauEtude())
                        .domaine(request.getDomaine())
                        .compte(compte)
                        .build();
                candidatRepository.save(candidat);
            }

            case RH -> {
                RH rh = RH.builder()
                        .nom(request.getNom())
                        .prenom(request.getPrenom())
                        .matricule(request.getMatricule())
                        .service(request.getService())
                        .compte(compte)
                        .build();
                rhRepository.save(rh);
            }

            case ENCADRANT -> {
                Encadrant encadrant = Encadrant.builder()
                        .nom(request.getNom())
                        .prenom(request.getPrenom())
                        .matricule(request.getMatricule())
                        .service(request.getService())
                        .specialite(request.getSpecialite())
                        .compte(compte)
                        .build();
                encadrantRepository.save(encadrant);
            }

            case ADMIN -> {
                // pas de profil métier pour l’instant
            }
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(compte.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, compte.getUsername(), compte.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getMotDePasse()
                )
        );

        Compte compte = compteRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(compte.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, compte.getUsername(), compte.getRole().name());
    }
}