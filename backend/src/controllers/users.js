import User from "../models/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export const getAuthenticatedUser = async (req, res, next) => {
  try {
    const user = User.findById(req.session.userId).select("+email").exec();
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }

  try {
    const { username, email, password: passwordRaw } = req.body;

    const existingUsername = await User.findOne({ username }).exec();

    if (existingUsername) {
      return res.status(409).json({ username: { msg: "Username already exists. Please choose another one." } });
    }

    const existingEmail = await User.findOne({ email }).exec();

    if (existingEmail) {
      return res.status(409).json({ email: { msg: "Email already registered. Please log in instead" } });
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await User.create({ username, email, password: passwordHashed });

    req.session.userId = newUser._id;

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped());
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password +email").exec();

    if (!user) {
      return res.status(401).json({ username: { msg: "Invalid credentials" } });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ password: { msg: "Invalid credentials" } });
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
