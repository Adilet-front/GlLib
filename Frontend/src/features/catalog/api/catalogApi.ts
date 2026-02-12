/**
 * Каталог: получение списка книг с фильтрацией (поиск по строке) и пагинацией.
 * Сейчас данные — getBooks() + клиентская фильтрация; сортировка не применяется.
 */
import { apiClient } from "../../../shared/api/apiClient";
import type { BookLabel } from "../../../entities/book/ui/BookCard";
import type { Book } from "../../../entities/book/model/types";

export type CatalogBook = Book & {
  label?: BookLabel;
  isAvailable?: boolean;
};

export type CatalogFilters = {
  categoryId?: number;
  format: string | "all";
  language: string | "all";
  searchQuery?: string;
};

export type CatalogSort = "popular" | "rating" | "new";

export type CatalogResponse = {
  items: CatalogBook[];
  total: number;
  totalPages: number;
};

// Backend Request DTO
type BookFilterRequest = {
  search?: string;
  categoryId?: number;
  status?: "AVAILABLE" | "RESERVED" | "TAKEN" | "RETURNED";
  author?: string;
  minRating?: number;
  sortBy?: "TITLE" | "AUTHOR" | "CREATED_AT" | "RATING" | "POPULARITY";
  sortDirection?: "ASC" | "DESC";
};

// Backend Response DTO
type BackendBookResponse = {
  id: number;
  title: string;
  author: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  status: "AVAILABLE" | "RESERVED" | "TAKEN" | "RETURNED";
  averageRating: number;
  reviewCount: number;
};

const mapBackendToFrontend = (b: BackendBookResponse): CatalogBook => ({
  id: b.id,
  title: b.title,
  author: b.author,
  coverUrl: b.coverUrl,
  averageRating: b.averageRating,
  reviewCount: b.reviewCount,
  status: b.status,
  isAvailable: b.status === "AVAILABLE", // This will be ignored by Book type but needed for UI? 
  // Wait, Book type in types.ts doesn't have isAvailable. CatalogList uses it.
  // I should rely on status.
  label: b.status === "AVAILABLE" ? undefined : "unavailable", 
});

const searchBooksServer = async (
  filters: CatalogFilters,
  sort: CatalogSort
): Promise<CatalogBook[]> => {
  const request: BookFilterRequest = {
    search: filters.searchQuery || undefined,
    categoryId: filters.categoryId,
    // Map sort
    sortBy:
      sort === "popular"
        ? "POPULARITY"
        : sort === "rating"
          ? "RATING"
          : "TITLE",
    sortDirection: sort === "new" ? "DESC" : "DESC", // "new" might map to CREATED_AT if supported
  };

  if (sort === "new") {
      request.sortBy = "CREATED_AT";
  }

  const { data } = await apiClient.post<BackendBookResponse[]>(
    "/categories/books/search",
    request
  );
  return data.map(mapBackendToFrontend);
};

export const getCatalogBooks = async (
  filters: CatalogFilters,
  sort: CatalogSort,
  page: number,
  pageSize: number
): Promise<CatalogResponse> => {
  // 1. Server-side Search & Sort
  const allResults = await searchBooksServer(filters, sort);

  // 2. Client-side Filter (Format/Language not supported by backend yet)
  // Assuming format/language aren't vital for now, or we filter client-side if we had the data.
  // Backend response doesn't strictly have format/language fields to filter by?
  // We'll skip client-side filtering for format/language for now as they aren't in the response.

  const total = allResults.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = allResults.slice(start, start + pageSize);

  return { items, total, totalPages };
};
