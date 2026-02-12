import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveCoverUrl } from "../../../shared/lib/media/cover";
import type { Book as BaseBook } from "../model/types";
import styles from "./BookCard.module.scss";

type BookLabel = "hit" | "exclusive" | "new" | "unavailable";

type Book = BaseBook & {
  price?: string;
  label?: BookLabel;
};

type BookCardProps = {
  book: Book;
  isAuthed: boolean;
};

const labelKey: Record<BookLabel, string> = {
  hit: "labels.hit",
  exclusive: "labels.exclusive",
  new: "labels.new",
  unavailable: "labels.unavailable",
};

export const BookCard = ({ book, isAuthed }: BookCardProps) => {
  const { t } = useTranslation();
  const [inCart, setInCart] = useState(false);
  const coverSrc = resolveCoverUrl(book.coverUrl);

  return (
    <article className={styles.card}>
      <Link
        to={`/book/${book.id}`}
        state={{ book }}
        className={styles.cardLink}
        aria-label={`Открыть ${book.title}`}
      >
        {coverSrc ? (
          <img className={styles.cover} src={coverSrc} alt="" loading="lazy" />
        ) : (
          <div className={styles.cover} aria-hidden="true" />
        )}
        <div className={styles.meta}>
          {book.label ? (
            <span className={`${styles.label} ${styles[book.label]}`}>
              {t(labelKey[book.label])}
            </span>
          ) : null}
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>
      </Link>
      <div className={styles.footer}>
        {book.price ? <div className={styles.price}>{book.price}</div> : null}
        {isAuthed ? (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => setInCart((prev) => !prev)}
            >
              {inCart ? t("actions.inCart") : t("actions.toCart")}
            </button>
          </div>
        ) : (
          <div className={styles.cta}>
            <span>{t("actions.signInToContinue")}</span>
            <Link to="/auth/login">{t("actions.signIn")}</Link>
          </div>
        )}
      </div>
    </article>
  );
};

export type { Book, BookLabel };
