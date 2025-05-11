package com.example.projet07.service;

import com.example.projet07.parsers.security.SecurityTacticParser;
import com.example.projet07.parsers.performance.PerformanceTacticParser;
import com.example.projet07.parsers.availability.AvailabilityTacticParser;
import com.example.projet07.parsers.shared.SimpleCharStream;
import com.example.projet07.parsers.shared.TokenMgrError;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ParserService {

    private final Map<String, File> tempFiles = new ConcurrentHashMap<>();

    // **Reusable parser instances**
    private SecurityTacticParser security;
    private AvailabilityTacticParser availability;
    private PerformanceTacticParser performance;

    /**
     * Save uploaded file as a temporary file and validate its syntax.
     */
    public Map<String, Object> saveAndValidate(InputStream uploadedInputStream) throws IOException {
        File tempFile = File.createTempFile("uploaded-", ".uml");
        tempFile.deleteOnExit();

        try (FileOutputStream out = new FileOutputStream(tempFile)) {
            uploadedInputStream.transferTo(out);
        }

        try (FileInputStream fis = new FileInputStream(tempFile)) {
            availability = new AvailabilityTacticParser(fis);

            if (availability.CorrectSyntax) {
                String fileId = UUID.randomUUID().toString();
                tempFiles.put(fileId, tempFile);
                return Map.of("valid", true, "fileId", fileId);
            } else {
                tempFile.delete();
                return Map.of("valid", false);
            }
        }
        catch (TokenMgrError e) {
            tempFile.delete();
            return Map.of("valid", false);
        }
    }

    /**
     * Process the previously uploaded file based on the chosen tactic.
     */
    public List<String> processBasedOnChoice(String fileId, String choice) throws IOException {
        File file = tempFiles.get(fileId);
        if (file == null || !file.exists()) {
            throw new FileNotFoundException("File with ID " + fileId + " not found");
        }

        try (FileInputStream fis = new FileInputStream(file)) {

            switch (choice.toLowerCase()) {
                case "availability":
                    availability = new AvailabilityTacticParser(fis);
                    availability.parse();
                    return availability.occurrenceStrings;

                case "security":
                    security = new SecurityTacticParser(fis);
                    security.parse();
                    return security.occurrenceStrings;

                case "performance":
                    performance = new PerformanceTacticParser(fis);
                    performance.parse();
                    return performance.occurrenceStrings;

                default:
                    throw new IllegalArgumentException("Unknown tactic: " + choice);
            }
        }

    }

    /**
     * Cleanup method (e.g., after tactic is processed).
     */
    public void removeFile(String fileId) {
        File file = tempFiles.remove(fileId);
        if (file != null) {
            file.delete();
        }
    }
}
