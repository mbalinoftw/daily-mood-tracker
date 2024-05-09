import { body } from "express-validator";

const signUpInputs = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .bail()
    .toLowerCase(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Register a valid email")
    .bail()
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isStrongPassword({ minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 2, minSymbols: 1 })
    .withMessage("Password must contain: at least 6 characters, 1 Uppercase, 1 Symbol, 2 Numbers"),
];

const logInInputs = [
  body("username").notEmpty().withMessage("Enter your username").bail().toLowerCase(),
  body("password").notEmpty().withMessage("Enter your password").bail(),
];

export const validate = { signUpInputs, logInInputs };
