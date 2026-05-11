package com.backend.backend.controller;

import com.backend.backend.dto.StageAffectationResponse;
import com.backend.backend.service.StageAffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadrant/stages")
@RequiredArgsConstructor
public class EncadrantStageController {

    private final StageAffectationService stageService;

    @GetMapping
    public List<StageAffectationResponse> mesStages(Authentication authentication) {
        return stageService.getStagesEncadrant(authentication.getName());
    }
}