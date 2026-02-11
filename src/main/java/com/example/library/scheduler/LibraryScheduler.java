package com.example.library.scheduler;

import com.example.library.enam.BookStatus;
import com.example.library.enam.NotificationType;
import com.example.library.enam.ReservationStatus;
import com.example.library.entity.Reservation;
import com.example.library.repository.ReservationRepository;
import com.example.library.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LibraryScheduler {

    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void checkReservations() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Напоминание через 20 часов (статус ACTIVE)
        List<Reservation> toRemind = reservationRepository.findAllByStatusAndReservedAtBetween(
                ReservationStatus.ACTIVE, now.minusHours(21), now.minusHours(20));

        for (Reservation res : toRemind) {
            notificationService.createNotification(
                    res.getUser(),
                    "Пора забрать книгу",
                    "У вас осталось 4 часа, чтобы забрать книгу: " + res.getBook().getTitle(),
                    NotificationType.REMINDER_TO_PICKUP
            );
        }

        // 2. Автоотмена через 24 часа (перевод из ACTIVE в EXPIRED)
        List<Reservation> toExpire = reservationRepository.findAllByStatusAndReservedAtBefore(
                ReservationStatus.ACTIVE, now.minusHours(24));

        for (Reservation res : toExpire) {
            res.setStatus(ReservationStatus.EXPIRED); // Твой статус
            res.getBook().setStatus(BookStatus.AVAILABLE); // Книга снова свободна

            notificationService.createNotification(
                    res.getUser(),
                    "Бронь аннулирована",
                    "Время ожидания (24ч) для книги '" + res.getBook().getTitle() + "' истекло.",
                    NotificationType.RESERVATION_CANCELLED
            );
        }
    }

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public void checkBorrowedBooks() {
        LocalDateTime now = LocalDateTime.now();

        // 3. Проверка тех, кто забрал (статус COMPLETED)
        // 14 дней
        List<Reservation> twoWeeks = reservationRepository.findAllByStatusAndReservedAtBetween(
                ReservationStatus.COMPLETED, now.minusDays(15), now.minusDays(14));

        // 28 дней
        List<Reservation> overdue = reservationRepository.findAllByStatusAndReservedAtBefore(
                ReservationStatus.COMPLETED, now.minusDays(28));

        // ... логика отправки уведомлений как раньше ...
    }
}
