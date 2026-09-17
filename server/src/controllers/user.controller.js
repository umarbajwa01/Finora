const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user.toSafeObject()));
});

// PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "avatar", "currency", "theme", "notificationPreferences"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  });
  res.json(new ApiResponse(200, user.toSafeObject(), "Profile updated."));
});

// POST /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.userId).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;
  user.refreshTokenHash = null; // force re-login on other sessions
  await user.save();

  res.json(new ApiResponse(200, null, "Password changed successfully."));
});

// GET /api/users/export
const exportTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });

  const header = "Date,Type,Category,Amount,Description,PaymentMethod\n";
  const rows = transactions
    .map(
      (t) =>
        `${t.date.toISOString().split("T")[0]},${t.type},${t.category},${t.amount},"${(
          t.description || ""
        ).replace(/"/g, '""')}",${t.paymentMethod}`
    )
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=finora-transactions.csv");
  res.send(header + rows);
});

module.exports = { getMe, updateMe, changePassword, exportTransactions };
