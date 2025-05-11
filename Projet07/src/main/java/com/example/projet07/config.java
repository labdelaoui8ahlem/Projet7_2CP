package com.example.projet07;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class config implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow all origins to access the API. You can limit this to your frontend's URL.
        registry.addMapping("/api/Tool")
                .allowedOrigins("http://localhost:8080") // Change to your front-end URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowCredentials(true);
    }
}

