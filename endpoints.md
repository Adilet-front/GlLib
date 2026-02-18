Servers

http://localhost:8080 - Generated server url

Authorize
Authentication Controller
Регистрация, вход и восстановление доступа

POST
/auth/reset-password
Установка нового пароля

POST
/auth/register
Регистрация нового пользователя

POST
/auth/register-admin
Регистрация администратора

POST
/auth/login
Вход в систему

POST
/auth/forgot-password
Запрос на восстановление пароля

PATCH
/auth/admin/users/{id}/approve
Одобрение регистрации (Admin Only)

GET
/auth/confirm
Подтверждение Email

GET
/auth/confirm-email-change
Подтверждение смены Email

DELETE
/auth/admin/users/{id}
Удаление пользователя (Admin Only)

Reservation Controller
Контроллер для управления бронированиями книг: резервирование, выдача, возврат и просмотр

POST
/reservations/{id}/take
Взять забронированную книгу

POST
/reservations/{id}/return
Вернуть книгу

POST
/reservations/{bookId}
Забронировать книгу

GET
/reservations/overdue
Получить список просроченных книг

GET
/reservations/my
Получить все мои бронирования

GET
/reservations/my/active
Получить активные бронирования

DELETE
/reservations/{id}
Отменить бронирование

Profile Controller
Управление профилем пользователя и загрузка аватарок

PUT
/api/profile/update
Обновить Имя и Фамилию

POST
/api/profile/update-email
Запросить смену Email

POST
/api/profile/avatar
Загрузить аватарку

GET
/api/profile/me
Получить данные моего профиля

Category Controller
Контроллер для управления категориями книг и поиска книг по категориям

PUT
/categories/{id}
Обновить категорию

DELETE
/categories/{id}
Удалить категорию

GET
/categories
Получить все категории

POST
/categories
Создать новую категорию

POST
/categories/books/search
Поиск книг по фильтрам

Book Controller
Контроллер для управления книгами: создание, получение, удаление книг и управление обложками

PUT
/books/admin/{id}
Редактировать книгу

DELETE
/books/admin/{id}
Удалить книгу

POST
/books/{id}/cover
Загрузить обложку для книги

POST
/books/admin/create
Создать новую книгу

PATCH
/books/admin/soft-delete/{id}
Мягкое удаление книги (архивация)

GET
/books
Получить все книги

GET
/books/{id}
Получить книгу по ID

GET
/books/{id}/history
Получить историю книги

GET
/books/admin/reservations
Получить список всех бронирований (для админа)

Notification Controller
Управление системными уведомлениями пользователя

PATCH
/api/notifications/{id}/read
Пометить уведомление как прочитанное

GET
/api/notifications
Получить все уведомления текущего пользователя

GET
/api/notifications/unread-count
Количество непрочитанных уведомлений

review-controller

PUT
/review/{reviewId}
Редактировать свой отзыв

DELETE
/review/{reviewId}
Удалить отзыв (автор или админ)

GET
/review/{id}/reviews
Получить все отзывы книги

POST
/review/{id}/reviews
Оставить отзыв (1-5 звезд)

admin-user-controller

GET
/admin/users
Получить список пользователей с фильтрацией по статусу одобрения

{
"openapi": "3.1.0",
"info": {
"title": "Library API",
"description": "Books, reservations, MinIO covers",
"version": "1.0"
},
"servers": [
{
"url": "http://localhost:8080",
"description": "Generated server url"
}
],
"security": [
{
"bearerAuth": []
}
],
"tags": [
{
"name": "Authentication Controller",
"description": "Регистрация, вход и восстановление доступа"
},
{
"name": "Reservation Controller",
"description": "Контроллер для управления бронированиями книг: резервирование, выдача, возврат и просмотр"
},
{
"name": "Profile Controller",
"description": "Управление профилем пользователя и загрузка аватарок"
},
{
"name": "Category Controller",
"description": "Контроллер для управления категориями книг и поиска книг по категориям"
},
{
"name": "Book Controller",
"description": "Контроллер для управления книгами: создание, получение, удаление книг и управление обложками"
},
{
"name": "Notification Controller",
"description": "Управление системными уведомлениями пользователя"
}
],
"paths": {
"/review/{reviewId}": {
"put": {
"tags": [
"review-controller"
],
"summary": "Редактировать свой отзыв",
"operationId": "updateReview",
"parameters": [
{
"name": "reviewId",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/ReviewRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/ReviewResponse"
}
}
}
}
}
},
"delete": {
"tags": [
"review-controller"
],
"summary": "Удалить отзыв (автор или админ)",
"operationId": "deleteReview",
"parameters": [
{
"name": "reviewId",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
}
}
},
"/categories/{id}": {
"put": {
"tags": [
"Category Controller"
],
"summary": "Обновить категорию",
"description": "Изменение названия или описания категории. Нужен ADMIN",
"operationId": "update",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/CategoryRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
},
"delete": {
"tags": [
"Category Controller"
],
"summary": "Удалить категорию",
"description": "Удаляет категорию, если к ней не привязана ни одна книга. Нужен ADMIN",
"operationId": "delete",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/admin/{id}": {
"put": {
"tags": [
"Book Controller"
],
"summary": "Редактировать книгу",
"description": "Обновление данных книги. Нужен ADMIN",
"operationId": "update*1",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/_": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
},
"delete": {
"tags": [
"Book Controller"
],
"summary": "Удалить книгу",
"description": "Удаление книги из библиотеки по её ID. Требуется роль ADMIN",
"operationId": "delete_1",
"parameters": [
{
"name": "id",
"in": "path",
"description": "Идентификатор книги для удаления",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
},
"example": 1
}
],
"responses": {
"200": {
"description": "Книга успешно удалена"
},
"401": {
"description": "Пользователь не авторизован"
},
"403": {
"description": "Недостаточно прав (требуется роль ADMIN)"
},
"404": {
"description": "Книга с указанным ID не найдена"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/api/profile/update": {
"put": {
"tags": [
"Profile Controller"
],
"summary": "Обновить Имя и Фамилию",
"operationId": "update_2",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/UpdateProfileRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/UserResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/review/{id}/reviews": {
"get": {
"tags": [
"review-controller"
],
"summary": "Получить все отзывы книги",
"operationId": "getReviews",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/ReviewResponse"
}
}
}
}
}
}
},
"post": {
"tags": [
"review-controller"
],
"summary": "Оставить отзыв (1-5 звезд)",
"operationId": "addReview",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/ReviewRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/ReviewResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/{id}/take": {
"post": {
"tags": [
"Reservation Controller"
],
"summary": "Взять забронированную книгу",
"description": "Отметка о фактическом получении книги",
"operationId": "take",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/{id}/return": {
"post": {
"tags": [
"Reservation Controller"
],
"summary": "Вернуть книгу",
"description": "Возврат книги в библиотеку",
"operationId": "returnBook",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/{bookId}": {
"post": {
"tags": [
"Reservation Controller"
],
"summary": "Забронировать книгу",
"description": "Создание бронирования для указанной книги.",
"operationId": "reserve",
"parameters": [
{
"name": "bookId",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "Книга успешно забронирована",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/categories": {
"get": {
"tags": [
"Category Controller"
],
"summary": "Получить все категории",
"description": "Возвращает список всех доступных категорий книг",
"operationId": "getAll",
"responses": {
"200": {
"description": "Список категорий успешно получен",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/Category"
}
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/Category"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
},
"post": {
"tags": [
"Category Controller"
],
"summary": "Создать новую категорию",
"description": "Создание новой категории для книг. Требуется роль ADMIN",
"operationId": "create",
"requestBody": {
"description": "Данные для создания категории",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/CategoryRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "Категория успешно создана",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
},
"400": {
"description": "Некорректные данные запроса",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
},
"403": {
"description": "Недостаточно прав (требуется роль ADMIN)",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
},
"409": {
"description": "Категория с таким названием уже существует",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/Category"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/categories/books/search": {
"post": {
"tags": [
"Category Controller"
],
"summary": "Поиск книг по фильтрам",
"description": "Поиск книг с использованием различных фильтров: по категориям, автору, названию и т.д.",
"operationId": "search",
"requestBody": {
"description": "Параметры фильтрации для поиска книг",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookFilterRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "Результаты поиска успешно получены",
"content": {
"application/json": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"400": {
"description": "Некорректные параметры фильтра",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/{id}/cover": {
"post": {
"tags": [
"Book Controller"
],
"summary": "Загрузить обложку для книги",
"description": "Загрузка изображения обложки для указанной книги. Поддерживаемые форматы: JPEG, PNG",
"operationId": "uploadCover",
"parameters": [
{
"name": "id",
"in": "path",
"description": "Идентификатор книги",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
},
"example": 1
}
],
"requestBody": {
"content": {
"multipart/form-data": {
"schema": {
"type": "object",
"properties": {
"file": {
"type": "string",
"format": "binary",
"description": "Файл обложки (изображение)"
}
},
"required": [
"file"
]
}
}
}
},
"responses": {
"200": {
"description": "Обложка успешно загружена",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"400": {
"description": "Некорректный файл или формат изображения",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"404": {
"description": "Книга с указанным ID не найдена",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/admin/create": {
"post": {
"tags": [
"Book Controller"
],
"summary": "Создать новую книгу",
"description": "Создание новой книги в библиотеке. Требуется роль ADMIN",
"operationId": "create_1",
"requestBody": {
"description": "Данные для создания книги",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookCreateRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "Книга успешно создана",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"400": {
"description": "Некорректные данные запроса",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"403": {
"description": "Недостаточно прав (требуется роль ADMIN)",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/auth/reset-password": {
"post": {
"tags": [
"Authentication Controller"
],
"summary": "Установка нового пароля",
"description": "Принимает токен из письма и новый пароль.",
"operationId": "resetPassword",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/ResetPasswordRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
}
}
},
"/auth/register": {
"post": {
"tags": [
"Authentication Controller"
],
"summary": "Регистрация нового пользователя",
"description": "Создает аккаунт. После регистрации необходимо подтвердить email.",
"operationId": "register",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/RegisterRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/AuthResponse"
}
}
}
}
}
}
},
"/auth/register-admin": {
"post": {
"tags": [
"Authentication Controller"
],
"summary": "Регистрация администратора",
"description": "Создание пользователя с правами ADMIN.",
"operationId": "registerAdmin",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/RegisterRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "string"
}
}
}
}
}
}
},
"/auth/login": {
"post": {
"tags": [
"Authentication Controller"
],
"summary": "Вход в систему",
"description": "Возвращает JWT токен при успешной авторизации.",
"operationId": "login",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/LoginRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/AuthResponse"
}
}
}
}
}
}
},
"/auth/forgot-password": {
"post": {
"tags": [
"Authentication Controller"
],
"summary": "Запрос на восстановление пароля",
"description": "Отправляет ссылку со сбросом пароля на указанный email.",
"operationId": "forgotPassword",
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/ForgotPasswordRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
}
}
},
"/api/profile/update-email": {
"post": {
"tags": [
"Profile Controller"
],
"summary": "Запросить смену Email",
"description": "Отправляет ссылку подтверждения на новый адрес",
"operationId": "updateEmail",
"parameters": [
{
"name": "newEmail",
"in": "query",
"required": true,
"schema": {
"type": "string"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/api/profile/avatar": {
"post": {
"tags": [
"Profile Controller"
],
"summary": "Загрузить аватарку",
"description": "Загружает файл в Minio и сохраняет ссылку в профиль",
"operationId": "uploadAvatar",
"requestBody": {
"content": {
"multipart/form-data": {
"schema": {
"type": "object",
"properties": {
"file": {
"type": "string",
"format": "binary"
}
},
"required": [
"file"
]
}
}
}
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/admin/soft-delete/{id}": {
"patch": {
"tags": [
"Book Controller"
],
"summary": "Мягкое удаление книги (архивация)",
"operationId": "softDelete",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/auth/admin/users/{id}/approve": {
"patch": {
"tags": [
"Authentication Controller"
],
"summary": "Одобрение регистрации (Admin Only)",
"description": "Активация аккаунта пользователя администратором. Только после подтверждения почты.",
"operationId": "approve",
"parameters": [
{
"name": "id",
"in": "path",
"description": "ID пользователя для одобрения",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
}
}
},
"/api/notifications/{id}/read": {
"patch": {
"tags": [
"Notification Controller"
],
"summary": "Пометить уведомление как прочитанное",
"description": "Меняет статус уведомления на 'прочитано' по его ID",
"operationId": "markAsRead",
"parameters": [
{
"name": "id",
"in": "path",
"description": "ID уведомления",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
},
"example": 10
}
],
"responses": {
"200": {
"description": "Статус успешно обновлен"
},
"404": {
"description": "Уведомление с таким ID не найдено"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/overdue": {
"get": {
"tags": [
"Reservation Controller"
],
"summary": "Получить список просроченных книг",
"description": "Доступно только администратору",
"operationId": "overdue",
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/my": {
"get": {
"tags": [
"Reservation Controller"
],
"summary": "Получить все мои бронирования",
"operationId": "my",
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/reservations/my/active": {
"get": {
"tags": [
"Reservation Controller"
],
"summary": "Получить активные бронирования",
"operationId": "myActive",
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books": {
"get": {
"tags": [
"Book Controller"
],
"summary": "Получить все книги",
"description": "Возвращает список всех книг в библиотеке. Доступно для пользователей с ролью USER и ADMIN",
"operationId": "getAll_1",
"responses": {
"200": {
"description": "Список книг успешно получен",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/{id}": {
"get": {
"tags": [
"Book Controller"
],
"summary": "Получить книгу по ID",
"description": "Возвращает информацию о конкретной книге по её идентификатору",
"operationId": "getById",
"parameters": [
{
"name": "id",
"in": "path",
"description": "Идентификатор книги",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
},
"example": 1
}
],
"responses": {
"200": {
"description": "Книга найдена",
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
},
"404": {
"description": "Книга с указанным ID не найдена",
"content": {
"_/_": {
"schema": {
"$ref": "#/components/schemas/BookResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/{id}/history": {
"get": {
"tags": [
"Book Controller"
],
"summary": "Получить историю книги",
"description": "Возвращает историю действий с книгой. Доступно только для ADMIN",
"operationId": "getBookHistory",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "История получена",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookHistoryResponse"
}
}
}
}
},
"401": {
"description": "Пользователь не авторизован",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookHistoryResponse"
}
}
}
}
},
"403": {
"description": "Недостаточно прав (требуется роль ADMIN)",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/BookHistoryResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/books/admin/reservations": {
"get": {
"tags": [
"Book Controller"
],
"summary": "Получить список всех бронирований (для админа)",
"description": "Возвращает список всех записей о бронировании с возможностью фильтрации по статусу",
"operationId": "getAllReservations",
"parameters": [
{
"name": "status",
"in": "query",
"description": "Фильтр по статусу (ACTIVE, COMPLETED, RETURNED, CANCELLED)",
"required": false,
"schema": {
"type": "string",
"enum": [
"ACTIVE",
"COMPLETED",
"EXPIRED",
"CANCELLED",
"RETURNED"
]
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"_/_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/ReservationResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/auth/confirm": {
"get": {
"tags": [
"Authentication Controller"
],
"summary": "Подтверждение Email",
"description": "Активация токена, пришедшего на почту после регистрации.",
"operationId": "confirm",
"parameters": [
{
"name": "token",
"in": "query",
"required": true,
"schema": {
"type": "string"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
}
}
},
"/auth/confirm-email-change": {
"get": {
"tags": [
"Authentication Controller"
],
"summary": "Подтверждение смены Email",
"description": "Эндпоинт, по которому кликает юзер в письме",
"operationId": "confirmEmailChange",
"parameters": [
{
"name": "token",
"in": "query",
"required": true,
"schema": {
"type": "string"
}
},
{
"name": "newEmail",
"in": "query",
"required": true,
"schema": {
"type": "string"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
}
}
},
"/api/profile/me": {
"get": {
"tags": [
"Profile Controller"
],
"summary": "Получить данные моего профиля",
"operationId": "getMe",
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"$ref": "#/components/schemas/UserResponse"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/api/notifications": {
"get": {
"tags": [
"Notification Controller"
],
"summary": "Получить все уведомления текущего пользователя",
"description": "Возвращает список всех уведомлений (прочитанных и непрочитанных) для авторизованного юзера",
"operationId": "getMyNotifications",
"responses": {
"200": {
"description": "Список уведомлений успешно получен",
"content": {
"_/\_": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/NotificationResponse"
}
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/api/notifications/unread-count": {
"get": {
"tags": [
"Notification Controller"
],
"summary": "Количество непрочитанных уведомлений",
"description": "Используется для отображения счетчика на иконке колокольчика",
"operationId": "getUnreadCount",
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "integer",
"format": "int64"
}
}
}
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/admin/users": {
"get": {
"tags": [
"admin-user-controller"
],
"summary": "Получить список пользователей с фильтрацией по статусу одобрения",
"operationId": "getAllUsers",
"parameters": [
{
"name": "enabled",
"in": "query",
"required": false,
"schema": {
"type": "boolean"
}
}
],
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "array",
"items": {
"$ref": "#/components/schemas/UserResponse"
}
}
}
}
}
}
}
},
"/reservations/{id}": {
"delete": {
"tags": [
"Reservation Controller"
],
"summary": "Отменить бронирование",
"operationId": "cancel",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"responses": {
"200": {
"description": "OK"
}
},
"security": [
{
"bearerAuth": []
}
]
}
},
"/auth/admin/users/{id}": {
"delete": {
"tags": [
"Authentication Controller"
],
"summary": "Удаление пользователя (Admin Only)",
"description": "Админ удаляет пользователя, подтверждая действие своим паролем.",
"operationId": "deleteUser",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "integer",
"format": "int64"
}
}
],
"requestBody": {
"content": {
"application/json": {
"schema": {
"$ref": "#/components/schemas/UserDeleteRequest"
}
}
},
"required": true
},
"responses": {
"200": {
"description": "OK",
"content": {
"*/*": {
"schema": {
"type": "string"
}
}
}
}
}
}
}
},
"components": {
"schemas": {
"ReviewRequest": {
"type": "object",
"properties": {
"rating": {
"type": "integer",
"format": "int32",
"description": "Оценка от 1 до 5",
"example": 5
},
"comment": {
"type": "string",
"description": "Текст отзыва",
"example": "Очень интересная книга!"
}
}
},
"ReviewResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"userEmail": {
"type": "string"
},
"rating": {
"type": "integer",
"format": "int32"
},
"comment": {
"type": "string"
},
"createdAt": {
"type": "string",
"format": "date-time"
}
}
},
"CategoryRequest": {
"type": "object",
"properties": {
"name": {
"type": "string"
},
"description": {
"type": "string"
}
},
"required": [
"name"
]
},
"Category": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"name": {
"type": "string"
},
"description": {
"type": "string"
}
}
},
"BookRequest": {
"type": "object",
"properties": {
"title": {
"type": "string"
},
"author": {
"type": "string"
},
"description": {
"type": "string"
},
"categoryId": {
"type": "integer",
"format": "int64"
},
"location": {
"type": "string"
}
}
},
"BookResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"title": {
"type": "string"
},
"author": {
"type": "string"
},
"description": {
"type": "string"
},
"category": {
"type": "string"
},
"location": {
"type": "string"
},
"coverUrl": {
"type": "string"
},
"status": {
"type": "string",
"enum": [
"AVAILABLE",
"RESERVED",
"TAKEN",
"RETURNED",
"IN_YOUR_HANDS"
]
},
"averageRating": {
"type": "number",
"format": "double"
},
"reviewCount": {
"type": "integer",
"format": "int32"
}
}
},
"UpdateProfileRequest": {
"type": "object",
"properties": {
"firstName": {
"type": "string"
},
"lastName": {
"type": "string"
}
}
},
"UserResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"email": {
"type": "string"
},
"firstName": {
"type": "string"
},
"lastName": {
"type": "string"
},
"role": {
"type": "string"
},
"enabled": {
"type": "boolean"
},
"avatarUrl": {
"type": "string"
}
}
},
"ReservationResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"user": {
"$ref": "#/components/schemas/UserResponse"
},
"bookId": {
"type": "integer",
"format": "int64"
},
"bookTitle": {
"type": "string"
},
"reservedAt": {
"type": "string",
"format": "date-time"
},
"takenAt": {
"type": "string",
"format": "date-time"
},
"returnedAt": {
"type": "string",
"format": "date-time"
},
"status": {
"type": "string",
"enum": [
"ACTIVE",
"COMPLETED",
"EXPIRED",
"CANCELLED",
"RETURNED"
]
}
}
},
"BookFilterRequest": {
"type": "object",
"properties": {
"search": {
"type": "string"
},
"categoryId": {
"type": "integer",
"format": "int64"
},
"status": {
"type": "string",
"enum": [
"AVAILABLE",
"RESERVED",
"TAKEN",
"RETURNED",
"IN_YOUR_HANDS"
]
},
"author": {
"type": "string"
},
"location": {
"type": "string"
},
"tags": {
"type": "array",
"items": {
"type": "string"
}
},
"minRating": {
"type": "number",
"format": "double"
},
"sortBy": {
"type": "string",
"enum": [
"TITLE",
"AUTHOR",
"CREATED_AT",
"RATING",
"POPULARITY"
]
},
"sortDirection": {
"type": "string",
"enum": [
"ASC",
"DESC"
]
},
"dateFrom": {
"type": "string",
"format": "date"
},
"dateTo": {
"type": "string",
"format": "date"
}
}
},
"BookCreateRequest": {
"type": "object",
"properties": {
"title": {
"type": "string"
},
"author": {
"type": "string"
},
"description": {
"type": "string"
},
"categoryId": {
"type": "integer",
"format": "int64"
},
"location": {
"type": "string"
}
}
},
"ResetPasswordRequest": {
"type": "object",
"properties": {
"token": {
"type": "string"
},
"newPassword": {
"type": "string",
"maxLength": 2147483647,
"minLength": 6
}
},
"required": [
"token"
]
},
"RegisterRequest": {
"type": "object",
"properties": {
"email": {
"type": "string"
},
"password": {
"type": "string",
"maxLength": 2147483647,
"minLength": 6
},
"firstName": {
"type": "string"
},
"lastName": {
"type": "string"
}
},
"required": [
"email",
"firstName",
"lastName",
"password"
]
},
"AuthResponse": {
"type": "object",
"properties": {
"token": {
"type": "string"
}
}
},
"LoginRequest": {
"type": "object",
"properties": {
"email": {
"type": "string"
},
"password": {
"type": "string"
}
}
},
"ForgotPasswordRequest": {
"type": "object",
"properties": {
"email": {
"type": "string"
}
}
},
"BookHistoryResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"eventType": {
"type": "string",
"enum": [
"RESERVED",
"CANCELLED",
"TAKEN",
"RETURNED",
"EXPIRED"
]
},
"userEmail": {
"type": "string"
},
"comment": {
"type": "string"
},
"createdAt": {
"type": "string",
"format": "date-time"
}
}
},
"NotificationResponse": {
"type": "object",
"properties": {
"id": {
"type": "integer",
"format": "int64"
},
"title": {
"type": "string"
},
"message": {
"type": "string"
},
"createdAt": {
"type": "string",
"format": "date-time"
},
"isRead": {
"type": "boolean"
},
"type": {
"type": "string",
"enum": [
"RESERVATION_SUCCESS",
"REMINDER_TO_PICKUP",
"RESERVATION_CANCELLED",
"RETURN_REMINDER",
"OVERDUE_ALERT"
]
}
}
},
"UserDeleteRequest": {
"type": "object",
"properties": {
"adminPassword": {
"type": "string"
}
}
}
},
"securitySchemes": {
"bearerAuth": {
"type": "http",
"scheme": "bearer",
"bearerFormat": "JWT"
}
}
}
}
