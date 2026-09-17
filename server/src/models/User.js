const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { CURRENCIES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Password is only required for locally-registered accounts. Google accounts
    // authenticate via a verified Google ID token and never set a local password.
    password: {
      type: String,
      minlength: 8,
      select: false,
      required: function isPasswordRequired() {
        return this.authProvider === "local";
      },
    },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null, index: true, sparse: true },
    avatar: { type: String, default: "" },
    currency: { type: String, enum: CURRENCIES, default: "USD" },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    notificationPreferences: {
      budgetWarnings: { type: Boolean, default: true },
      recurringReminders: { type: Boolean, default: true },
      goalProgress: { type: Boolean, default: true },
      monthlySummary: { type: Boolean, default: true },
    },
    refreshTokenHash: { type: String, select: false, default: null },
    passwordResetTokenHash: { type: String, select: false, default: null },
    passwordResetExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false); // Google-only account, no local password
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    currency: this.currency,
    theme: this.theme,
    notificationPreferences: this.notificationPreferences,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
