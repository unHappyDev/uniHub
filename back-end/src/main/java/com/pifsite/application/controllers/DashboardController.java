package com.pifsite.application.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import com.pifsite.application.service.DashboardService;

import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/dashboard")
@Tag(name = "DashboardController", description = "Endpoints to get the data from the dashboard")
public class DashboardController {

    DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {

        return ResponseEntity.ok(dashboardService.getData());
    }

}
