const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateTokens = require("../utils/generateTokens");
const ApiResponse = require("../utils/apiResponse");
const commonOptions = require("../config/common");
const sendEmail = require("../services/mail");
const { generateResetPasswordEmail } = require("../utils/emailTemplate");

const isProd = process.env.NODE_ENV === "production";
const sameSite = isProd ? "None" : "Lax";
const secure = sameSite === "None";

const register = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json(new ApiResponse(201, "User registered successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to register user", null));
  }
};

const devRegister = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const { code } = req.params;

    if (code !== commonOptions.code)
      return res.status(401).json(new ApiResponse(401, "Invalid Credential"));

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "admin",
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(201)
      .json(new ApiResponse(201, "Developer registered successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to register user", null));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json(new ApiResponse(400, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json(new ApiResponse(400, "Invalid credentials"));
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
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      }),
    );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, "Failed to login", null));
  }
};

const refresh = async (req, res) => {
  console.log("try to refresh", req.cookies.refresh);
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json(new ApiResponse(400, "No refresh token"));

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    console.log("decoded after refresh the token", decoded);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json(new ApiResponse(401, "User not found"));

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(new ApiResponse(200, "New access token", accessToken));
  } catch {
    res.status(401).json(new ApiResponse(401, "Invalid refresh token", null));
  }
};

const me = async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User details retrieved successfully", {
      user: req.user,
    }),
  );
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure,
    sameSite,
  });

  res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(400, "Email is required"));
    }

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // save token + expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    // frontend reset url
    const resetUrl = `${commonOptions.clientUrl}/reset-password/${resetToken}`;

    // HTML email
    const html = generateResetPasswordEmail({
      name: user.name || "User",
      resetUrl,
    });

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      text: `Reset your password: ${resetUrl}`,
      html,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Password reset link sent to email", resetUrl),
      );
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json(new ApiResponse(500, "Server error"));
  }
};

module.exports = {
  register,
  devRegister,
  login,
  logout,
  forgotPassword,
  me,
  refresh,
};
