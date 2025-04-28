package com.example.projet07.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

public class UserController {
@GetMapping("/index")
    public List<Integer> findAllUsers() {
        return List.of(23,232,9000);
    }
}
