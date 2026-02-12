package com.example.library.enam;

public enum NotificationType {
    RESERVATION_SUCCESS,    // Успешное бронирование
    REMINDER_TO_PICKUP,     // Напоминание забрать (через 20 часов)
    RESERVATION_CANCELLED,  // Автоотмена (через 24 часа)
    RETURN_REMINDER,        // Напоминание вернуть (14 дней)
    OVERDUE_ALERT           // Просрочка (28 дней)
}