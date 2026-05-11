package com.backend.backend.controller;

import com.backend.backend.dto.StageAffectationResponse;
import com.backend.backend.service.StageAffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@RequiredArgsConstructor
public class StageAffectationController {

    private final StageAffectationService stageService;

    @GetMapping("/me")
    public List<StageAffectationResponse> mesStages(Authentication authentication) {
        return stageService.getMesStages(authentication.getName());
    }
}