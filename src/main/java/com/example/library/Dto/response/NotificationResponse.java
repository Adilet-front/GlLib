package com.example.library.Dto.response;

import com.example.library.enam.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        LocalDateTime createdAt,
        boolean isRead,
        NotificationType type
) {}