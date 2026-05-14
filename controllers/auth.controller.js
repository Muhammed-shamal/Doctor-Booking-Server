const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateTokens = require("../utils/generateTokens");
const ApiResponse = require("../utils/apiResponse");

const isProd = process.env.NODE_ENV === "production";
const sameSite = isProd ? "None" : "Lax";
const secure = sameSite === "None";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to register user", null)
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(
      new ApiResponse(200, "Login Successful", {
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(500, "Failed to login", null)
    );
  }
};

const refresh = async (req, res) => {
  console.log("try to refresh", req.cookies.refresh);
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json(new ApiResponse(401, "Invalid refresh token", null));
  }
};

const me = async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User details retrieved successfully", {
      user: req.user,
    })
  );
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure,
    sameSite,
  });

  res.status(200).json(
    new ApiResponse(200, "Logged out successfully", null)
  );
};

module.exports = {
  register,
  login,
  logout,
  me,
  refresh,
};
