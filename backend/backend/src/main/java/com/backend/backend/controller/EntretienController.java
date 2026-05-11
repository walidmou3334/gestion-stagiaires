package com.backend.backend.controller;

import com.backend.backend.dto.EntretienResponse;
import com.backend.backend.service.EntretienService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entretiens")
@RequiredArgsConstructor
public class EntretienController {

    private final EntretienService entretienService;

    @GetMapping("/me")
    public List<EntretienResponse> mesEntretiens(Authentication authentication) {
        return entretienService.getMesEntretiens(authentication.getName());
    }
}