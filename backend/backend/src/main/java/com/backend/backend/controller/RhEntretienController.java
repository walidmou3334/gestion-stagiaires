package com.backend.backend.controller;

import com.backend.backend.dto.EntretienRequest;
import com.backend.backend.dto.EntretienResponse;
import com.backend.backend.service.EntretienService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rh/entretiens")
@RequiredArgsConstructor
public class RhEntretienController {

    private final EntretienService entretienService;

    @PostMapping
    public EntretienResponse planifier(@RequestBody EntretienRequest request) {
        return entretienService.planifierEntretien(request);
    }

    @GetMapping
    public List<EntretienResponse> getAll() {
        return entretienService.getAllEntretiens();
    }

    @PutMapping("/{id}/terminer")
    public EntretienResponse terminer(@PathVariable Long id) {
        return entretienService.terminerEntretien(id);
    }

    @PutMapping("/{id}/annuler")
    public EntretienResponse annuler(@PathVariable Long id) {
        return entretienService.annulerEntretien(id);
    }
}