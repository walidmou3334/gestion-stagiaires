package com.backend.backend.controller;

import com.backend.backend.dto.EncadrantRequest;
import com.backend.backend.entity.Encadrant;
import com.backend.backend.service.EncadrantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rh/encadrants")
@RequiredArgsConstructor
public class RhEncadrantController {

    private final EncadrantService encadrantService;

    @GetMapping
    public List<Encadrant> getAll(){
        return encadrantService.getAll();
    }

    @PostMapping
    public Encadrant create(
            @RequestBody EncadrantRequest request
    ){
        return encadrantService.create(request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ){
        encadrantService.delete(id);
    }
}