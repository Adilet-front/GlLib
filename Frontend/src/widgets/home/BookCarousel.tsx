import { BookCard, type Book } from "../../entities/book/ui/BookCard";
import styles from "./BookCarousel.module.scss";

type BookCarouselProps = {
  title: string;
  books: Book[];
  isAuthed: boolean;
};

export const BookCarousel = ({ title, books, isAuthed }: BookCarouselProps) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2>{title}</h2>
    </div>
    <div className={styles.track}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} isAuthed={isAuthed} />
      ))}
    </div>
  </section>
);
