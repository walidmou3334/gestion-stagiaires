package com.backend.backend.service;

import com.backend.backend.entity.Compte;
import com.backend.backend.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final CompteRepository compteRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Compte compte = compteRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        return new User(
                compte.getUsername(),
                compte.getMotDePasse(),
                compte.isActif(),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + compte.getRole().name()))
        );
    }
}
