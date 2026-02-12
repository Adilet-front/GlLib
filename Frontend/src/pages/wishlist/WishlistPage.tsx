/**
 * Страница «Отложенные»: книги, добавленные в список «хочу прочитать» (wishlist).
 * Данные из bookingStore (getWishlist); показываются только отложенные без активной брони.
 */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookCard, type Book } from "../../entities/book/ui/BookCard";
import { useBookingStore } from "../../features/book/model/bookingStore";
import styles from "./WishlistPage.module.scss";

export const WishlistPage = () => {
  const { t } = useTranslation();
  const bookings = useBookingStore((s) => s.bookings);
  const removeWish = useBookingStore((s) => s.removeWish);

  const wishlistItems = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.active &&
          b.readingStatus === "WILL_READ" &&
          !b.bookedAt &&
          !b.borrowedAt,
      ),
    [bookings],
  );

  const books: Book[] = useMemo(
    () =>
      wishlistItems.map((b) => ({
        id: b.bookSnapshot.id,
        title: b.bookSnapshot.title,
        author: b.bookSnapshot.author,
        label: b.bookSnapshot.label,
        coverUrl: b.bookSnapshot.coverUrl,
      })),
    [wishlistItems],
  );

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>{t("pages.wishlistTitle")}</h1>
        <p>{t("wishlist.subtitle")}</p>
      </div>
      <div className={styles.grid}>
        {books.length ? (
          books.map((book) => (
            <div key={book.id} className={styles.cardWrap}>
              <BookCard book={book} isAuthed />
              <div className={styles.actions}>
                <Link
                  to={`/book/${book.id}`}
                  className={styles.linkButton}
                  state={{ book: wishlistItems.find((w) => w.bookSnapshot.id === book.id)?.bookSnapshot }}
                >
                  {t("wishlist.openBook")}
                </Link>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeWish(book.id)}
                >
                  {t("wishlist.remove")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>{t("wishlist.empty")}</p>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
