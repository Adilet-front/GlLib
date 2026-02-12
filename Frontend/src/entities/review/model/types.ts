/** Модель отзыва о книге */
export type Review = {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};
