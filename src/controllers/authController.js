import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const isProduction = process.env.NODE_ENV;

export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        message: "User already exists!",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(201).json({
      message: "Succesfully created the user",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1hr",
      },
    );

    if (user.role === "admin") {
      res.clearCookie("refreshToken");
      res.cookie("admin_token", accessToken, {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: "none",
        path: "/",
      });
      return res.status(200).json({
        message: "Admin login successfully",
      });
    }

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      },
    );

    res.clearCookie("refreshToken");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successfully",
      accessToken,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login user",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to logout",
    });
  }
};
