import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCatalogBooks } from "../../features/catalog/api/catalogApi";
import { BookCard, type Book } from "../../entities/book/ui/BookCard";
import styles from "./SearchPage.module.scss";

const PAGE_SIZE = 24;

export const SearchPage = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";

  const {
    data: catalogData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      getCatalogBooks(
        {
          format: "all",
          language: "all",
          searchQuery: query,
        },
        "popular",
        1,
        PAGE_SIZE,
      ),
    enabled: query.length > 0,
  });

  const { items = [], total = 0 } = catalogData ?? {};

  const books: Book[] = items.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    label: book.label,
    coverUrl: book.coverUrl,
  }));

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Результаты поиска</h1>
          <p>
            {query
              ? `Запрос: "${query}". Найдено: ${total}`
              : "Введите запрос для поиска."}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.empty}>Загрузка...</div>
      ) : isError ? (
        <div className={styles.empty}>
          Не удалось загрузить книги. Проверьте API и попробуйте снова.
        </div>
      ) : books.length ? (
        <div className={styles.grid}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} isAuthed />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>{t("catalog.empty")}</div>
      )}
    </section>
  );
};

export default SearchPage;
