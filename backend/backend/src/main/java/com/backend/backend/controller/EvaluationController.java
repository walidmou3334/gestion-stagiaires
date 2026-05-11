package com.backend.backend.controller;

import com.backend.backend.dto.EvaluationResponse;
import com.backend.backend.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/me")
    public List<EvaluationResponse> mesEvaluations(Authentication authentication) {
        return evaluationService.getMesEvaluations(authentication.getName());
    }
}