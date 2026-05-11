package com.backend.backend.controller;

import com.backend.backend.dto.EvaluationRequest;
import com.backend.backend.dto.EvaluationResponse;
import com.backend.backend.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadrant/evaluations")
@RequiredArgsConstructor
public class EncadrantEvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    public EvaluationResponse creer(
            @RequestBody EvaluationRequest request,
            Authentication authentication
    ) {
        return evaluationService.creerEvaluation(authentication.getName(), request);
    }

    @GetMapping
    public List<EvaluationResponse> mesEvaluations(Authentication authentication) {
        return evaluationService.getEvaluationsEncadrant(authentication.getName());
    }
}