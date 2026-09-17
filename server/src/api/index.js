require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/config/db");

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};