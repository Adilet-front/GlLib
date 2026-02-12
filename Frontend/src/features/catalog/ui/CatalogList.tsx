/**
 * Каталог книг: фильтры (жанр, формат, язык), сортировка, пагинация.
 * Данные через getCatalogBooks (features/catalog/api); карточки — BookCard.
 * Бесплатная библиотека — фильтр по цене не используется.
 */
import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/model/useAuth";
import { BookCard, type Book } from "../../../entities/book/ui/BookCard";
import { Button } from "../../../shared/ui/Button/Button";
import { Select } from "../../../shared/ui/Select/Select";
import {
  getCatalogBooks,
  type CatalogFilters,
  type CatalogSort,
} from "../api/catalogApi";
import { getCategories } from "../../../entities/category/api/categoryApi";
import styles from "./CatalogList.module.scss";

const PAGE_SIZE = 8;

export const CatalogList = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<CatalogFilters>({
    categoryId: undefined,
    format: "all",
    language: "all",
    searchQuery: undefined,
  });
  const [sort, setSort] = useState<CatalogSort>("popular");
  const [page, setPage] = useState(1);

  // 1. Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await getCategories();
      return data;
    },
  });

  const {
    data: catalogData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["catalog", filters, sort, page],
    queryFn: () => getCatalogBooks(filters, sort, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const { items = [], total = 0, totalPages = 1 } = catalogData ?? {};

  const books: Book[] = useMemo(
    () =>
      items.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        label: book.label,
        coverUrl: book.coverUrl,
        averageRating: book.averageRating,
        status: book.status,
      })),
    [items],
  );

  const handleFilterChange = (
    key: keyof CatalogFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: t("catalog.all") },
      ...categories.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
      })),
    ],
    [categories, t],
  );

  const formatOptions = useMemo(
    () => [
      { value: "all", label: t("catalog.all") },
      { value: "ebook", label: t("catalog.formats.ebook") },
      { value: "audio", label: t("catalog.formats.audio") },
    ],
    [t],
  );

  const languageOptions = useMemo(
    () => [
      { value: "all", label: t("catalog.all") },
      { value: "ru", label: t("catalog.languages.ru") },
      { value: "en", label: t("catalog.languages.en") },
      { value: "kg", label: t("catalog.languages.kg") },
    ],
    [t],
  );

  const sortOptions = useMemo(
    () => [
      { value: "popular", label: t("catalog.sorts.popular") },
      { value: "rating", label: t("catalog.sorts.rating") },
      { value: "new", label: "Новинки" },
    ],
    [t],
  );

  return (
    <section className={styles.catalog}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>{t("catalog.title")}</h1>
          <p>{t("catalog.subtitle")}</p>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <div className={styles.filtersHeader}>
            <strong>{t("catalog.filters")}</strong>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setFilters({
                  categoryId: undefined,
                  format: "all",
                  language: "all",
                });
                setPage(1);
              }}
            >
              {t("catalog.reset")}
            </Button>
          </div>
          <Select
            label={t("catalog.genre")}
            options={categoryOptions}
            value={filters.categoryId ? String(filters.categoryId) : "all"}
            onChange={(event) => {
              const val = event.target.value;
              handleFilterChange(
                "categoryId",
                val === "all" ? undefined : Number(val),
              );
            }}
          />
          <Select
            label={t("catalog.format")}
            options={formatOptions}
            value={filters.format}
            onChange={(event) =>
              handleFilterChange("format", event.target.value)
            }
          />
          <Select
            label={t("catalog.language")}
            options={languageOptions}
            value={filters.language}
            onChange={(event) =>
              handleFilterChange("language", event.target.value)
            }
          />
        </aside>

        <div className={styles.content}>
          <div className={styles.sortRow}>
            <div className={styles.count}>
              {t("catalog.count", { count: total })}
            </div>
            <Select
              label={t("catalog.sort")}
              options={sortOptions}
              className={styles.sortSelect}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as CatalogSort);
                setPage(1);
              }}
            />
          </div>
          {isLoading ? (
            <div className={styles.empty}>Загрузка...</div>
          ) : isError ? (
            <div className={styles.empty}>
              Не удалось загрузить книги. Проверьте API и попробуйте снова.
            </div>
          ) : books.length ? (
            <div className={styles.grid}>
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className={styles.gridItem}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <BookCard book={book} isAuthed={isAuthenticated} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>{t("catalog.empty")}</div>
          )}
          <div className={styles.pagination}>
            <Button
              variant="default"
              size="sm"
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              {t("catalog.prev")}
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageIndex = index + 1;
              return (
                <Button
                  key={pageIndex}
                  variant={pageIndex === page ? "primary" : "default"}
                  size="sm"
                  type="button"
                  onClick={() => setPage(pageIndex)}
                >
                  {pageIndex}
                </Button>
              );
            })}
            <Button
              variant="default"
              size="sm"
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={page === totalPages}
            >
              {t("catalog.next")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
