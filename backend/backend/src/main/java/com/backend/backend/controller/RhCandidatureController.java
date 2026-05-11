package com.backend.backend.controller;

import com.backend.backend.dto.CandidatureResponse;
import com.backend.backend.service.RhCandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rh/candidatures")
@RequiredArgsConstructor
public class RhCandidatureController {

    private final RhCandidatureService rhCandidatureService;

    @GetMapping
    public List<CandidatureResponse> getAllCandidatures() {
        return rhCandidatureService.getAllCandidatures();
    }

    @PutMapping("/{id}/accepter")
    public CandidatureResponse accepter(@PathVariable Long id) {
        return rhCandidatureService.accepterCandidature(id);
    }

    @PutMapping("/{id}/refuser")
    public CandidatureResponse refuser(@PathVariable Long id) {
        return rhCandidatureService.refuserCandidature(id);
    }
}