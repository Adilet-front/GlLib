/**
 * Страница книги: данные по id (или из location.state), обложка, мета, похожие, бронирование.
 * Использует bookingStore (отложенные) и API резерваций; при 401 редирект на логин.
 */
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../entities/book/ui/BookCard";
import { getBookById, getBooks } from "../../../entities/book/api/bookApi";
import type { Book as ApiBook } from "../../../entities/book/model/types";
import {
  cancelReservation,
  getUserActiveReservations,
  reserveBook,
  returnReservation,
  takeReservation,
} from "../../../entities/booking/api/bookingApi";
import type { Reservation } from "../../../entities/booking/model/types";
import { useBookingStore } from "../model/bookingStore";
import { resolveCoverUrl } from "../../../shared/lib/media/cover";
import { BookMeta } from "./BookMeta";
import { BookSimilar } from "./BookSimilar";
import styles from "./BookDetails.module.scss";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const mapBookToCard = (book: ApiBook): Book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
});

export const BookDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const bookings = useBookingStore((s) => s.bookings);
  const addWish = useBookingStore((s) => s.addWish);
  const removeWish = useBookingStore((s) => s.removeWish);

  const stateBook = (
    location.state as { book?: Book & { location?: string } } | null
  )?.book;
  const bookId = id ?? stateBook?.id;

  const { data: bookData, isLoading: isBookLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookById(String(bookId)),
    enabled: Boolean(bookId),
  });

  const { data: booksData = [] } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: activeReservations = [] } = useQuery({
    queryKey: ["reservations", "active"],
    queryFn: async () => {
      const { data } = await getUserActiveReservations();
      return data;
    },
    enabled: Boolean(bookId),
  });

  const book = useMemo(() => {
    if (bookData) {
      return bookData;
    }
    if (stateBook) {
      return {
        id: Number(stateBook.id),
        title: stateBook.title,
        author: stateBook.author,
        description: "",
        location: stateBook.location,
      } as ApiBook;
    }
    return null;
  }, [bookData, stateBook]);

  const reservation = useMemo<Reservation | undefined>(() => {
    if (!book) return undefined;
    return activeReservations.find((item) => item.bookId === book.id);
  }, [activeReservations, book]);
  const bookStatus = book?.status ?? "AVAILABLE";
  const similarBooks = useMemo(() => {
    if (!book) {
      return [];
    }
    const sameCategory = book.category
      ? booksData.filter(
          (item) => item.id !== book.id && item.category === book.category,
        )
      : [];
    const source = sameCategory.length
      ? sameCategory
      : booksData.filter((item) => item.id !== book.id);
    return source.slice(0, 4).map(mapBookToCard);
  }, [book, booksData]);

  const invalidateReservations = () => {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
    if (bookId) {
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    }
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };

  const reserveMutation = useMutation({
    mutationFn: (targetBookId: number) => reserveBook(targetBookId),
    onSuccess: invalidateReservations,
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 409) {
        alert("Книга уже забронирована или выдана.");
      }
    },
  });

  const takeMutation = useMutation({
    mutationFn: (reservationId: number) => takeReservation(reservationId),
    onSuccess: invalidateReservations,
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 409) {
        alert("Бронь не активна или истекла.");
      }
    },
  });

  const returnMutation = useMutation({
    mutationFn: (reservationId: number) => returnReservation(reservationId),
    onSuccess: invalidateReservations,
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 409) {
        alert("Нельзя вернуть эту книгу.");
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) => cancelReservation(reservationId),
    onSuccess: invalidateReservations,
    onError: (error) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 409) {
        alert("Нельзя отменить эту бронь.");
      }
    },
  });

  const handleReserve = () => {
    if (!book) {
      return;
    }
    reserveMutation.mutate(book.id);
  };

  const handleTake = () => {
    if (!reservation) {
      return;
    }
    takeMutation.mutate(reservation.id);
  };

  const handleReturn = () => {
    if (!reservation) {
      return;
    }
    returnMutation.mutate(reservation.id);
  };

  const handleCancel = () => {
    if (!reservation) {
      return;
    }
    cancelMutation.mutate(reservation.id);
  };

  if (!book && isBookLoading) {
    return <section className={styles.details}>Загрузка...</section>;
  }

  if (!book) {
    return (
      <section className={styles.details}>
        Книга не найдена. Попробуйте вернуться в каталог.
      </section>
    );
  }

  const canReserve = bookStatus === "AVAILABLE" && !reservation;
  const canTake = Boolean(reservation && !reservation.takenAt);
  const canReturn = Boolean(reservation && reservation.takenAt && !reservation.returnedAt);
  const canCancel = Boolean(reservation && !reservation.takenAt);

  const inWishlist = book
    ? bookings.some(
        (b) =>
          b.bookId === book.id &&
          b.active &&
          b.readingStatus === "WILL_READ" &&
          !b.bookedAt &&
          !b.borrowedAt,
      )
    : false;

  const handleWishlistClick = () => {
    if (!book) return;
    const bookId = book.id;
    if (inWishlist) {
      removeWish(bookId);
    } else {
      addWish({
        id: bookId,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        location: book.location,
      });
    }
  };

  const coverSrc = resolveCoverUrl(book.coverUrl);

  return (
    <section className={styles.details}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/catalog">Каталог</Link>
        {book.category ? (
          <>
            <span>›</span>
            <span>{book.category}</span>
          </>
        ) : null}
        <span>›</span>
        <span>{book.title}</span>
      </nav>
      <div className={styles.hero}>
        {coverSrc ? (
          <img className={styles.cover} src={coverSrc} alt="" />
        ) : (
          <div className={styles.cover} />
        )}
        <div className={styles.info}>
          <h1 className={styles.title}>{book.title}</h1>
          <div className={styles.author}>{book.author}</div>
          <div className={styles.metaRow}>
            <BookMeta
              meta={{
                description: book.description,
              }}
            />
          </div>
          <div className={styles.statusRow}>
            <div
              className={`${styles.statusChip} ${
                bookStatus === "AVAILABLE"
                  ? styles.statusAvailable
                  : bookStatus === "RESERVED"
                    ? styles.statusReserved
                    : styles.statusBorrowed
              }`}
            >
              <span className={styles.statusDot} aria-hidden="true" />
              {bookStatus === "AVAILABLE"
                ? "Доступна"
                : bookStatus === "RESERVED"
                  ? "Забронирована"
                  : bookStatus === "TAKEN"
                    ? "На руках"
                    : "Возвращена"}
            </div>
            {reservation?.reservedAt ? (
              <div className={styles.bookingChip}>
                Бронь:{" "}
                {new Date(reservation.reservedAt).toLocaleString("ru-RU")}
              </div>
            ) : null}
            {reservation?.takenAt ? (
              <div className={styles.bookingChip}>
                Забрал: {new Date(reservation.takenAt).toLocaleString("ru-RU")}
              </div>
            ) : null}
            {reservation?.returnedAt ? (
              <div className={styles.bookingChip}>
                Вернул: {new Date(reservation.returnedAt).toLocaleString("ru-RU")}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.underHero}>
          <button
            type="button"
            className={`${styles.wishlistButton} ${inWishlist ? styles.wishlistActive : ""}`}
            onClick={handleWishlistClick}
          >
            <HeartIcon />
            {inWishlist ? t("wishlist.remove") : t("book.actions.wishlist")}
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionPrimary}`}
            onClick={handleReserve}
            disabled={!canReserve || reserveMutation.isPending}
          >
            Забронировать
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleTake}
            disabled={!canTake || takeMutation.isPending}
          >
            Я забрал книгу
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionGhost}`}
            onClick={handleReturn}
            disabled={!canReturn || returnMutation.isPending}
          >
            Вернуть книгу
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleCancel}
            disabled={!canCancel || cancelMutation.isPending}
          >
            Отменить бронь
          </button>
          <div className={styles.location}>
            Локация: {book.location ?? "—"}
          </div>
        </div>
      </div>

      <BookSimilar books={similarBooks} isAuthed />
    </section>
  );
};
