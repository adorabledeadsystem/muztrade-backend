import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    login: req.body.login,
    passwordHash: hash,
  });

  const user = await doc.save();

  const token = jwt.sign(
    {
      _id: user._id,
    },
    "MuzTrade"
  );

  const { passwordHash, ...userData } = user._doc;

  res.json({
    ...userData,
    token,
  });
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: req.body.login });

    if (!user) {
      return res.status(404).json({
        message: "Введены неверные данные",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Введены неверные данные",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "MuzTrade"
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось войти",
    });
  }
};

export const user = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Ошибка входа",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось войти",
    });
  }
};
