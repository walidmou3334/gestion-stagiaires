package com.backend.backend.controller;

import com.backend.backend.dto.EvaluationResponse;
import com.backend.backend.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rh/evaluations")
@RequiredArgsConstructor
public class RhEvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    public List<EvaluationResponse> all() {
        return evaluationService.getAllEvaluations();
    }
}