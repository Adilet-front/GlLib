package com.example.library.controller;

import com.example.library.Dto.response.NotificationResponse;
import com.example.library.service.NotificationService;
import com.example.library.service.impl.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Controller", description = "Управление системными уведомлениями пользователя")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Получить все уведомления текущего пользователя",
            description = "Возвращает список всех уведомлений (прочитанных и непрочитанных) для авторизованного юзера")
    @ApiResponse(responseCode = "200", description = "Список уведомлений успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = NotificationResponse.class))))
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userDetails.getUser().getId()));
    }

    @Operation(summary = "Количество непрочитанных уведомлений",
            description = "Используется для отображения счетчика на иконке колокольчика")
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userDetails.getUser().getId()));
    }

    @Operation(summary = "Пометить уведомление как прочитанное",
            description = "Меняет статус уведомления на 'прочитано' по его ID")
    @ApiResponse(responseCode = "200", description = "Статус успешно обновлен")
    @ApiResponse(responseCode = "404", description = "Уведомление с таким ID не найдено")
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @Parameter(description = "ID уведомления", example = "10") @PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
