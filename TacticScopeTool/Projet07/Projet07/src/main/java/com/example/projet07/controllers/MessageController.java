package com.example.projet07.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController

public class MessageController {
    @RequestMapping("/index")
    public String index () {
        return "Hello World";
    }

}
