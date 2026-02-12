package com.example.library.service;

import com.example.library.repository.ConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {
    private final ConfirmationTokenRepository tokenRepository;


    @Scheduled(fixedRate = 12,
    timeUnit=TimeUnit.HOURS)
    @Transactional
    public void removeExpiredTokens() {
        System.out.println("Дворник вышел на работу: чистим старые токены...");
        tokenRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());
    }
}