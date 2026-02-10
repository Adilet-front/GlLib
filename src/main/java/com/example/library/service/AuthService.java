package com.example.library.service;

import com.example.library.Dto.AuthResponse;
import com.example.library.Dto.LoginRequest;
import com.example.library.Dto.RegisterRequest;
import com.example.library.enam.Role;
import com.example.library.entity.ConfirmationToken;
import com.example.library.entity.User;
import com.example.library.exceptions.EmailAlreadyExistsException;
import com.example.library.repository.ConfirmationTokenRepository;
import com.example.library.repository.UserRepository;
import com.example.library.service.impl.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ConfirmationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .firstName(request.firstName()).lastName(request.lastName())
                .email(request.email())
                .password(encoder.encode(request.password()))
                .role(Role.USER)
                .enabled(false)       // Админ пока не видит
                .emailVerified(false)  // Почта не подтверждена
                .build();

        userRepository.save(user);

        ConfirmationToken token = new ConfirmationToken(user);
        tokenRepository.save(token); // Создай ConfirmationTokenRepository

        String link = "http://localhost:8080/auth/confirm?token=" + token.getToken();
        emailService.send(user.getEmail(), "Click here to confirm: " + link);

        return new AuthResponse("Please confirm your email. Check your inbox.");
    }


    public AuthResponse login(LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        UserDetailsImpl userDetails =
                (UserDetailsImpl) auth.getPrincipal();

        User user = userDetails.getUser(); // ✅ ВОТ ТАК

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }
        if (!user.isEnabled()) {
            throw new RuntimeException("Account waiting for admin approval");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }


    public String registerAdmin(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Admin already exists");
        }

        User admin = User.builder()
                .firstName(request.firstName()) // Добавили
                .lastName(request.lastName())
                .email(request.email())
                .password(encoder.encode(request.password()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);

        return "Admin registered successfully";
    }
    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        User user = confirmationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        // Теперь токен можно удалить
        tokenRepository.delete(confirmationToken);

        return "Email verified! Now wait for admin approval.";
    }

}


