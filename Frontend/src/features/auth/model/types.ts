/** Запрос логина/регистрации */
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = { token: string };

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: File;
};

/** Регистрация возвращает сообщение о pending approval, токен не возвращается */
export type RegisterResponse = { 
  message: string;
  token?: string; // Опциональный, так как не возвращается при pending approval
};
