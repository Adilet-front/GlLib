/**
 * API отзывов: создание отзыва к книге (рейтинг + комментарий).
 */
import { apiClient } from "../../../shared/api/apiClient";
import type { Review } from "../model/types";

export type CreateReviewRequest = {
  bookId: string;
  rating: number;
  comment?: string;
};

export type CreateReviewResponse = Review;

export const createReview = (payload: CreateReviewRequest) =>
  apiClient.post<CreateReviewResponse>("/reviews", payload);
