package com.example.projet07.controllers;

import com.example.projet07.parsers.availability.AvailabilityTacticParser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.projet07.parsers.availability.*;

import com.example.projet07.parsers.security.*;
import com.example.projet07.parsers.availability.*;
import com.example.projet07.parsers.performance.*;
import com.example.projet07.parsers.shared.*;
import com.example.projet07.parsers.security.SecurityTacticParser;
import com.example.projet07.parsers.availability.AvailabilityTacticParser;

import java.io.InputStream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.projet07.service.ParserService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Tool")
@CrossOrigin(origins = "http://localhost:8080")  // Add this line

public class UploadController {

    private final ParserService parserService;

    // Constructor injection of ParserService
    public UploadController(ParserService parserService) {
        this.parserService = parserService;
    }

    // Endpoint to check syntax of the uploaded file
    @PostMapping("/check-syntax")
    public ResponseEntity<Map<String, Object>> checkSyntax(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false));  // Return false if file is empty
        }

        try {
            // Get the InputStream from the uploaded file
            InputStream inputStream = file.getInputStream();

            // Validate syntax using the ParserService
            Map<String, Object> result = parserService.saveAndValidate(inputStream);

            // If the syntax is valid, return the fileId and valid status
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("valid", false));  // Handle errors and return false
        }
    }

    // Endpoint to process file based on user choice (availability, security, performance)
    @PostMapping("/process")
    public ResponseEntity<List<String>> processFile(
            @RequestParam("fileId") String fileId,
            @RequestParam("choice") String choice) {
        try {
            // Process the file based on the chosen tactic (availability, security, performance)
            List<String> result = parserService.processBasedOnChoice(fileId, choice);

            // Return the result as a list of strings
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of("Error processing the file"));
        }
    }
}

