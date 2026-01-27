package com.example.library.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Library API",
                version = "1.0",
                description = "Books, reservations, MinIO covers"
        )
)
@Configuration
public class OpenApiConfig {
}
