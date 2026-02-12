/**
 * Главная: карусели книг (популярное, новинки, рекомендации и т.д.).
 * Для авторизованных показываются блоки «Продолжить», «Для вас», «Недавно просмотренные».
 * Карусель «Популярное» и «Новинки» подгружаются из API; при отсутствии данных — моки.
 */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../features/auth/model/useAuth";
import { getBooks } from "../../entities/book/api/bookApi";
import { BookCarousel } from "../../widgets/home/BookCarousel";
import type { Book } from "../../entities/book/ui/BookCard";
import styles from "./HomePage.module.scss";

const FALLBACK_POPULAR: Book[] = [
  { id: 101, title: "Платформа", author: "М. Уэльбек", label: "hit" },
  { id: 102, title: "Тонкое искусство", author: "М. Мэнсон", label: "exclusive" },
  { id: 103, title: "Сила привычки", author: "Ч. Дахигг" },
  { id: 104, title: "Маленький принц", author: "А. де Сент-Экзюпери", label: "hit" },
];

export const HomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const { data: apiBooks = [] } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    retry: false, // Не повторять запрос при ошибке
  });

  const popularBooks: Book[] = useMemo(() => {
    // Проверяем, что apiBooks действительно массив и не пустой
    if (Array.isArray(apiBooks) && apiBooks.length > 0) {
      return apiBooks.slice(0, 8).map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        coverUrl: b.coverUrl,
      }));
    }
    return FALLBACK_POPULAR;
  }, [apiBooks]);

  const newBooksFromApi: Book[] = useMemo(() => {
    // Проверяем, что apiBooks действительно массив и достаточно длинный
    if (Array.isArray(apiBooks) && apiBooks.length > 8) {
      return apiBooks.slice(8, 16).map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        coverUrl: b.coverUrl,
      }));
    }
    return [];
  }, [apiBooks]);

  const FALLBACK_NEW: Book[] = [
    { id: 201, title: "Проект Феникс", author: "Дж. Ким", label: "new" },
    { id: 202, title: "Второй мозг", author: "Т. Форт", label: "new" },
    { id: 203, title: "Город женщин", author: "Э. Гилберт" },
    { id: 204, title: "Идеальный питч", author: "О. Петров" },
  ];
  const newBooks = newBooksFromApi.length > 0 ? newBooksFromApi : FALLBACK_NEW;

  const recommended: Book[] = [
    { id: 301, title: "Шантарам", author: "Г. Д. Робертс", label: "hit" },
    { id: 302, title: "Краткая история времени", author: "С. Хокинг" },
    { id: 303, title: "Маркетинг от А до Я", author: "Ф. Котлер", label: "exclusive" },
    { id: 304, title: "Чистая архитектура", author: "Р. Мартин" },
  ];

  const continueReading: Book[] = [
    { id: 401, title: "Бизнес с нуля", author: "Э. Рис", label: "hit" },
    { id: 402, title: "Дюна", author: "Ф. Герберт" },
    { id: 403, title: "Сквозь шторм", author: "Н. Гейман" },
  ];

  const recentViews: Book[] = [
    { id: 501, title: "Черный лебедь", author: "Н. Талеб" },
    { id: 502, title: "Искусство мыслить ясно", author: "Р. Добелли" },
    { id: 503, title: "Поток", author: "М. Чиксентмихайи", label: "exclusive" },
  ];

  return (
    <section className={styles.page}>
      {isAuthenticated ? (
        <>
          <BookCarousel
            title={t("sections.continue")}
            books={continueReading}
            isAuthed={isAuthenticated}
          />
          <BookCarousel
            title={t("sections.personal")}
            books={recommended}
            isAuthed={isAuthenticated}
          />
          <BookCarousel
            title={t("sections.recent")}
            books={recentViews}
            isAuthed={isAuthenticated}
          />
        </>
      ) : null}

      <BookCarousel
        title={t("sections.popular")}
        books={popularBooks}
        isAuthed={isAuthenticated}
      />
      <BookCarousel
        title={t("sections.new")}
        books={newBooks}
        isAuthed={isAuthenticated}
      />
      <BookCarousel
        title={t("sections.recommended")}
        books={recommended}
        isAuthed={isAuthenticated}
      />
    </section>
  );
};

export default HomePage;
