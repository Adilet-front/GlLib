package com.example.library.enam;

public enum ReservationStatus {
    ACTIVE,     // забронировал, ждёт
    COMPLETED, // забрал книгу
    EXPIRED,   // 24 часа вышли
    CANCELLED, // отменил сам
    RETURNED   // вернул книгу
}

