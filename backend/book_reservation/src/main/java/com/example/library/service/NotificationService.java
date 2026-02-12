package com.example.library.service;

import com.example.library.Dto.response.NotificationResponse;
import com.example.library.enam.NotificationType;
import com.example.library.entity.Notification;
import com.example.library.entity.User;
import com.example.library.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type) {
        // 1. Сохраняем в БД
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // 2. Дублируем на почту
        emailService.send(user.getEmail(), title + "\n\n" + message);
    }
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(), n.getTitle(), n.getMessage(),
                        n.getCreatedAt(), n.isRead(), n.getType()))
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Уведомление не найдено"));
        n.setRead(true);
        notificationRepository.save(n);
    }
}