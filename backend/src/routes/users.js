import express from "express";
import { logIn, logOut, signUp } from "../controllers/users.js";
import { validate } from "../middlewares/authValidations.js";

const router = express.Router();

router.post("/signup", validate.signUpInputs, signUp);
router.post("/login", validate.logInInputs, logIn);
router.post("/logout", logOut);

export default router;
