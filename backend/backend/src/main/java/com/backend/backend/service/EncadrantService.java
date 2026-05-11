package com.backend.backend.service;

import com.backend.backend.dto.EncadrantRequest;
import com.backend.backend.entity.*;
import com.backend.backend.repository.CompteRepository;
import com.backend.backend.repository.EncadrantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EncadrantService {

    private final EncadrantRepository encadrantRepository;
    private final CompteRepository compteRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Encadrant> getAll(){
        return encadrantRepository.findAll();
    }

    public Encadrant create(EncadrantRequest req){

        Compte compte = Compte.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .motDePasse(
                        passwordEncoder.encode(req.getMotDePasse())
                )
                .role(Role.ENCADRANT)
                .actif(true)
                .build();

        compte = compteRepository.save(compte);

        Encadrant encadrant = Encadrant.builder()
                .nom(req.getNom())
                .prenom(req.getPrenom())
                .matricule(req.getMatricule())
                .email(req.getEmail())
                .telephone(req.getTelephone())
                .specialite(req.getSpecialite())
                .service(req.getService())
                .compte(compte)
                .build();

        return encadrantRepository.save(encadrant);
    }

    public void delete(Long id){
        Encadrant e = encadrantRepository.findById(id)
                .orElseThrow();

        compteRepository.delete(e.getCompte());
        encadrantRepository.delete(e);
    }
}