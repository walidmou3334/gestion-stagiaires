package com.backend.backend.controller;

import com.backend.backend.dto.StageAffectationRequest;
import com.backend.backend.dto.StageAffectationResponse;
import com.backend.backend.service.StageAffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rh/stages")
@RequiredArgsConstructor
public class RhStageAffectationController {

    private final StageAffectationService stageService;

    @PostMapping("/affecter")
    public StageAffectationResponse affecter(@RequestBody StageAffectationRequest request) {
        return stageService.affecterStage(request);
    }

    @GetMapping
    public List<StageAffectationResponse> getAll() {
        return stageService.getAllStages();
    }

    @PutMapping("/{id}/terminer")
    public StageAffectationResponse terminer(@PathVariable Long id) {
        return stageService.terminerStage(id);
    }

    @PutMapping("/{id}/annuler")
    public StageAffectationResponse annuler(@PathVariable Long id) {
        return stageService.annulerStage(id);
    }
}