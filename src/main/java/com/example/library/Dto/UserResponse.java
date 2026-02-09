package com.example.library.Dto;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String role,
        boolean enabled // Чтобы в общем списке было видно статус
) {}