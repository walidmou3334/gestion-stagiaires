package com.backend.backend.controller;

import com.backend.backend.dto.*;
import com.backend.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/rh")
    public DashboardStatsResponse rhDashboard() {
        return dashboardService.getRhDashboard();
    }

    @GetMapping("/candidat")
    public CandidatDashboardResponse candidatDashboard(Authentication authentication) {
        return dashboardService.getCandidatDashboard(authentication.getName());
    }

    @GetMapping("/encadrant")
    public EncadrantDashboardResponse encadrantDashboard(Authentication authentication) {
        return dashboardService.getEncadrantDashboard(authentication.getName());
    }
}