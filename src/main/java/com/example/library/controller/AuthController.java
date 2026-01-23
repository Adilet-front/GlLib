package com.example.library.controller;


import com.example.library.Dto.AuthResponse;
import com.example.library.Dto.LoginRequest;
import com.example.library.Dto.RegisterRequest;
import com.example.library.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/test")
    public String test() {
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!test пройден!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        return "test";
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

}
