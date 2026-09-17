const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/generateTokens");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const REFRESH_COOKIE_NAME = "finora_refresh";

const setRefreshCookie = (res, token, rememberMe) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken, true);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: user.toSafeObject(), accessToken },
        "Account created successfully."
      )
    );
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshTokenHash");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken, !!rememberMe);

  res.json(
    new ApiResponse(200, { user: user.toSafeObject(), accessToken }, "Logged in successfully.")
  );
});

// POST /api/auth/google
// Verifies the Google ID token the frontend obtained via Google Identity
// Services, then finds or creates a matching local user and issues our own
// JWT pair — the rest of the app never needs to know Google was involved.
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(500, "Google sign-in is not configured on this server.");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired Google credential.");
  }

  const { email, name, picture, sub: googleId, email_verified: emailVerified } = payload;

  if (!email || !emailVerified) {
    throw new ApiError(400, "Your Google account must have a verified email address.");
  }

  let user = await User.findOne({ email }).select("+refreshTokenHash");

  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      avatar: picture || "",
      authProvider: "google",
      googleId,
    });
  } else if (!user.googleId) {
    // An existing local-password account is signing in with Google for the
    // first time using the same email — link the accounts instead of
    // creating a duplicate.
    user.googleId = googleId;
    if (!user.avatar && picture) user.avatar = picture;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken, true);

  res.json(
    new ApiResponse(200, { user: user.toSafeObject(), accessToken }, "Signed in with Google.")
  );
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, "No refresh token provided.");
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw new ApiError(401, "Refresh token invalid or expired.");
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user || user.refreshTokenHash !== hashToken(token)) {
    throw new ApiError(401, "Refresh token no longer valid.");
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  setRefreshCookie(res, newRefreshToken, true);

  res.json(new ApiResponse(200, { accessToken }, "Token refreshed."));
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
    } catch (err) {
      // token already invalid — nothing to clean up
    }
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.json(new ApiResponse(200, null, "Logged out."));
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond with success to avoid leaking which emails are registered.
  if (!user) {
    return res.json(
      new ApiResponse(200, null, "If that email exists, a reset link has been sent.")
    );
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = hashToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await user.save();

  // In production this would be emailed via a mail service (e.g. SendGrid/SES).
  // For development we log it so the flow is testable end-to-end.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV] Password reset token for ${email}: ${rawToken}`);
  }

  res.json(new ApiResponse(200, null, "If that email exists, a reset link has been sent."));
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpires");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired.");
  }

  user.password = password;
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  user.refreshTokenHash = null; // force re-login everywhere
  await user.save();

  res.json(new ApiResponse(200, null, "Password has been reset. Please log in."));
});

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
