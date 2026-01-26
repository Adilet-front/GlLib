package com.example.library.Dto;

import java.time.LocalDateTime;

public record ReservationResponse(
        Long id,
        Long bookId,
        String bookTitle,
        LocalDateTime reservedAt
) {}
