# Анализ кодовой базы office-lib-front

Краткий обзор структуры проекта и назначения слоёв. В коде добавлены комментарии (важные и поясняющие) — по ним можно быстро ориентироваться.

---

## Стек

- **React 19** + **TypeScript**
- **Vite** — сборка и dev-сервер
- **React Router** — маршруты
- **React Query (TanStack Query)** — запросы к API и кэш
- **Zustand** — глобальный стор авторизации
- **i18next** — переводы (ru, en, kg)
- **Axios** — HTTP-клиент с интерцепторами (токен, 401 → логин)
- **Sass (SCSS)** — стили, CSS-модули где нужно

---

## Архитектура (FSD-подобная)

```
src/
├── app/           # Инициализация приложения, роутинг, лейауты, провайдеры, i18n, глобальные стили
├── entities/      # Бизнес-сущности: API + типы (book, booking, category, review, user)
├── features/      # Фичи: auth, book (детали + бронирование), catalog, profile
├── pages/         # Страницы-композиции (роуты)
├── shared/        # Общее: apiClient, queryClient, env, token, cover URL, UI-компоненты
└── widgets/       # Крупные блоки: Header, Footer, LoginWidget, BookCard, BookCarousel, CatalogWidget, ProfileWidget
```

- **app** — точка входа, роутер, ErrorBoundary, QueryProvider, лейауты (AppLayout / AuthLayout), словари переводов.
- **entities** — только данные: типы и функции запросов к API (книги, брони, пользователь, категории, отзывы).
- **features** — логика и UI фич: авторизация (форма, guard, store, useAuth), карточка книги и бронирование, каталог с фильтрами, профиль.
- **pages** — собирают виджеты и фичи в экраны; минимальная логика.
- **shared** — переиспользуемое: axios с токеном и 401-редиректом, конфиг env, работа с токеном и URL обложек, Loader, ErrorFallback, StatusBadge.
- **widgets** — составные блоки для страниц: шапка с нав и поиском, футер, форма входа, карточка книги, карусель, виджет каталога/профиля.

---

## Важные файлы по смыслу

| Что | Где |
|-----|-----|
| Точка входа | `src/main.tsx` |
| Роуты, защита /profile | `src/app/router/index.tsx` |
| Лейаут с хедером/футером | `src/app/layouts/AppLayout.tsx` |
| Лейаут логина/регистрации | `src/app/layouts/AuthLayout.tsx` |
| HTTP-клиент, 401 → логин | `src/shared/api/apiClient.ts` |
| Токен в sessionStorage | `src/shared/lib/auth/token.ts` |
| Конфиг (API, обложки) | `src/shared/config/env.ts` |
| URL обложек (Minio/localhost) | `src/shared/lib/media/cover.ts` |
| Стор авторизации | `src/features/auth/model/authStore.ts` |
| Хук авторизации + загрузка профиля | `src/features/auth/model/useAuth.ts` |
| Защита маршрутов | `src/features/auth/model/AuthGuard.tsx` |
| Форма входа/регистрации | `src/features/auth/ui/LoginForm.tsx` |
| Страница книги, бронирование | `src/features/book/ui/BookDetails.tsx` |
| Каталог (фильтры, пагинация) | `src/features/catalog/ui/CatalogList.tsx`, `features/catalog/api/catalogApi.ts` |
| Переводы | `src/app/i18n/resources.ts` |
| Глобальные стили, форма авторизации, каталог | `src/app/styles/index.scss` |

---

## Потоки данных

- **Авторизация:** логин/регистрация → токен в sessionStorage → `setAccessToken` + `signIn()` из authStore → загрузка профиля (`getProfile`), в UI — `useAuth()`.
- **Запросы:** везде через `apiClient` (axios); токен подставляется интерцептором; 401 → очистка токена и редирект на `/auth/login`.
- **Книги и каталог:** entities/book (getBooks, getBookById), entities/booking (резервы); каталог — getCatalogBooks (пока поверх getBooks + клиентская фильтрация).
- **Обложки:** `resolveCoverUrl(coverUrl)` из `shared/lib/media/cover.ts` (учёт Minio/localhost и относительных путей).

---

## Что можно доработать (по комментариям в коде)

- **ErrorFallback** — сейчас заглушка; можно добавить кнопку «Обновить» и/или отправку в Sentry.
- **Loader** — при желании заменить на спиннер/скелетон.
- **Каталог** — сортировка в getCatalogBooks пока не применяется; фильтры только по searchQuery.
- **Главная** — данные каруселей захардкожены в HomePage; при необходимости заменить на API.
- **Дублирование роута** — в router был дубль `/lists`; оставлен один маршрут.

---

## Как искать по коду

- В начале файлов — комментарий **что это за модуль** и за что он отвечает.
- В `app/router/index.tsx` — комментарии по группам маршрутов (auth, app layout, guard, 404).
- В entities — кратко в api-файлах и в типах (модель с бэкенда).
- В features — описание фичи (форма, guard, каталог, профиль и т.д.).
- В shared — назначение утилит (токен, env, обложки, apiClient).

Весь важный и неочевидный код помечен комментариями, чтобы было сразу понятно.
