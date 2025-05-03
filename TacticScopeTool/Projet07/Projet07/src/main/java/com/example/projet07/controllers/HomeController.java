package com.example.projet07.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller//to give i nstructions for web traffic
public class HomeController {
    @RequestMapping("/")
    public String index(Model model) {
        model.addAttribute("surname","Sirine");
        return "index";
    }
}

