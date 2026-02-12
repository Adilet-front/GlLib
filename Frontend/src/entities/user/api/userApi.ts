/**
 * API текущего пользователя: профиль (GET /users/me).
 */
import { apiClient } from "../../../shared/api/apiClient";
import type { User } from "../model/types";

export const getProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
};
