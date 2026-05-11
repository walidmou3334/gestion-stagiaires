package com.backend.backend.controller;

import com.backend.backend.dto.LivrableResponse;
import com.backend.backend.dto.ValidationLivrableRequest;
import com.backend.backend.service.LivrableService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadrant/livrables")
@RequiredArgsConstructor
public class EncadrantLivrableController {

    private final LivrableService livrableService;

    @GetMapping
    public List<LivrableResponse> mesLivrables(Authentication authentication) {
        return livrableService.getLivrablesEncadrant(authentication.getName());
    }

    @PutMapping("/{id}/valider")
    public LivrableResponse valider(
            @PathVariable Long id,
            @RequestBody ValidationLivrableRequest request
    ) {
        return livrableService.validerLivrable(id, request);
    }

    @PutMapping("/{id}/rejeter")
    public LivrableResponse rejeter(
            @PathVariable Long id,
            @RequestBody ValidationLivrableRequest request
    ) {
        return livrableService.rejeterLivrable(id, request);
    }
}