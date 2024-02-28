import { body } from "express-validator";

export const registerValidation = [
  body("login").isLength({ min: 5 }),
  body("password").isLength({ min: 5 }),
];

export const loginValidation = [
  body("login").isLength({ min: 5 }),
  body("password").isLength({ min: 5 }),
];

export const newsCreateValidation = [
  body("title", "Введите название события").isLength({ min: 3 }).isString(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
  body("date", "Введите дату события").isString(),
  body("summary", "Введите краткое описание события").isString(),
  body("description", "Введите описание события").isString(),
];

export const photosCreateValidation = [
    body("date", "Введите дату события").isString(),
    body("summary", "Введите краткое описание события").isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
