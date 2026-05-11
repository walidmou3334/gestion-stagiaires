package com.backend.backend.controller;

import com.backend.backend.entity.Candidat;
import com.backend.backend.entity.Compte;
import com.backend.backend.entity.Encadrant;
import com.backend.backend.entity.RH;
import com.backend.backend.entity.Role;
import com.backend.backend.repository.CandidatRepository;
import com.backend.backend.repository.CompteRepository;
import com.backend.backend.repository.EncadrantRepository;
import com.backend.backend.repository.RHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final CompteRepository compteRepository;
    private final CandidatRepository candidatRepository;
    private final RHRepository rhRepository;
    private final EncadrantRepository encadrantRepository;

    @GetMapping("/me")
    public Map<String, Object> getMyProfile(Authentication authentication) {
        String username = authentication.getName();

        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", compte.getId());
        response.put("username", compte.getUsername());
        response.put("email", compte.getEmail());
        response.put("role", compte.getRole());
        response.put("actif", compte.isActif());

        if (compte.getRole() == Role.CANDIDAT) {
            Candidat candidat = candidatRepository.findByCompte(compte).orElse(null);
            response.put("profil", candidat);
        } else if (compte.getRole() == Role.RH) {
            RH rh = rhRepository.findByCompte(compte).orElse(null);
            response.put("profil", rh);
        } else if (compte.getRole() == Role.ENCADRANT) {
            Encadrant encadrant = encadrantRepository.findByCompte(compte).orElse(null);
            response.put("profil", encadrant);
        } else {
            response.put("profil", null);
        }

        return response;
    }
}