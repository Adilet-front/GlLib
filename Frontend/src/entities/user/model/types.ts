/** Модель пользователя (профиль с /users/me) */
export type User = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  enabled?: boolean;
};

/** Расширенный тип для админ панели */
export type UserResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
};
