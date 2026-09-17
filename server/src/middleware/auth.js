const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/generateTokens");
const User = require("../models/User");

// Protects routes: requires a valid access token in the Authorization header.
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  // Attach minimal identity to request; downstream code never trusts client-supplied userId.
  req.userId = user._id.toString();
  req.user = user;
  next();
});

module.exports = { requireAuth };
