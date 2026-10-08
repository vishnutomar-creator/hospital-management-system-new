require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hms",
  JWT_SECRET: process.env.JWT_SECRET || "hms_secret_key_12345",
};