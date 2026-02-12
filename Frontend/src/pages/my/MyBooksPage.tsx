import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BookCard, type Book } from "../../entities/book/ui/BookCard";
import { getBooks } from "../../entities/book/api/bookApi";
import { getUserReservations } from "../../entities/booking/api/bookingApi";
import type { Reservation } from "../../entities/booking/model/types";
import styles from "./MyBooksPage.module.scss";

type MyBook = Omit<Book, "status"> & {
  reservation?: Reservation;
  status: "TAKEN" | "RESERVED" | "RETURNED" | "CANCELLED";
};

export const MyBooksPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<
    "all" | "TAKEN" | "RESERVED" | "RETURNED" | "CANCELLED"
  >("all");

  const { data: rawReservations, isLoading } = useQuery({
    queryKey: ["reservations", "my"],
    queryFn: async () => {
      const { data } = await getUserReservations();
      return data;
    },
  });
  const reservations = Array.isArray(rawReservations) ? rawReservations : [];

  const { data: rawBooks } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });
  const books = Array.isArray(rawBooks) ? rawBooks : [];

  const ownedBooks = useMemo<MyBook[]>(() => {
    if (!reservations.length) return [];
    const bookMap = new Map(books.map((item) => [item.id, item]));
    return reservations.map((reservation) => {
      const book = bookMap.get(reservation.bookId);
      const status: MyBook["status"] = reservation.returnedAt
        ? "RETURNED"
        : reservation.takenAt
          ? "TAKEN"
          : reservation.status === "CANCELLED" || reservation.status === "EXPIRED"
            ? "CANCELLED"
            : "RESERVED";
      return {
        id: reservation.bookId,
        title: reservation.bookTitle ?? book?.title ?? "Без названия",
        author: book?.author ?? "—",
        coverUrl: book?.coverUrl,
        status,
        reservation,
      } as MyBook;
    });
  }, [books, reservations]);

  const list = useMemo(() => {
    const base = ownedBooks;
    if (status === "all") return base;
    return base.filter((book) => book.status === status);
  }, [ownedBooks, status]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>{t("pages.myBooksTitle")}</h1>
        <p>{t("my.subtitle")}</p>
      </div>
      <div className={styles.statusTabs}>
        <button
          type="button"
          className={status === "all" ? styles.tabActive : styles.tab}
          onClick={() => setStatus("all")}
        >
          Все
        </button>
        <button
          type="button"
          className={status === "TAKEN" ? styles.tabActive : styles.tab}
          onClick={() => setStatus("TAKEN")}
        >
          На руках
        </button>
        <button
          type="button"
          className={status === "RESERVED" ? styles.tabActive : styles.tab}
          onClick={() => setStatus("RESERVED")}
        >
          Забронирована
        </button>
        <button
          type="button"
          className={status === "RETURNED" ? styles.tabActive : styles.tab}
          onClick={() => setStatus("RETURNED")}
        >
          Возвращена
        </button>
        <button
          type="button"
          className={status === "CANCELLED" ? styles.tabActive : styles.tab}
          onClick={() => setStatus("CANCELLED")}
        >
          Отменена
        </button>
      </div>
      <div className={styles.grid}>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : list.length ? (
          list.map((book) => (
            <div key={book.id} className={styles.card}>
              <BookCard book={book as unknown as Book} isAuthed />
              <div className={styles.cardMeta}>
                <span className={styles.cardStatus}>
                  {book.status === "TAKEN"
                    ? "На руках"
                    : book.status === "RESERVED"
                      ? "Забронирована"
                      : book.status === "RETURNED"
                        ? "Возвращена"
                        : "Отменена"}
                </span>
                {book.reservation?.reservedAt ? (
                  <span>
                    Бронь:{" "}
                    {new Date(book.reservation.reservedAt).toLocaleDateString(
                      "ru-RU",
                    )}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div>Нет бронирований.</div>
        )}
      </div>
    </section>
  );
};

export default MyBooksPage;
