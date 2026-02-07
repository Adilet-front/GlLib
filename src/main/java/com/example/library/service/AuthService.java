package com.example.library.service;

import com.example.library.Dto.AuthResponse;
import com.example.library.Dto.LoginRequest;
import com.example.library.Dto.RegisterRequest;
import com.example.library.enam.Role;
import com.example.library.entity.User;
import com.example.library.exceptions.EmailAlreadyExistsException;
import com.example.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.email())
                .password(encoder.encode(request.password()))
                .role(Role.USER)
                .enabled(false) // ❗ ЖДЁТ АДМИНА
                .build();

        userRepository.save(user);

        return new AuthResponse(
                "Registration successful. Waiting for admin approval."
        );
    }


    public AuthResponse login(LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = (User) auth.getPrincipal();

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not approved by admin");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

}


