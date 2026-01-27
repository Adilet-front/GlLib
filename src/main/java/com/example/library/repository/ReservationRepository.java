package com.example.library.repository;

import com.example.library.enam.ReservationStatus;
import com.example.library.entity.Book;
import com.example.library.entity.Reservation;
import com.example.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser(User user);

    List<Reservation> findByStatusAndExpiresAtBefore(
            ReservationStatus status,
            LocalDateTime time
    );

    long countByUserAndStatusIn(
            User user,
            List<ReservationStatus> statuses
    );

    List<Reservation> findByUserAndStatusIn(
            User user,
            List<ReservationStatus> statuses
    );
}


