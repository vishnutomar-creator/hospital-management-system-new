require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

require("./events/user.events");
require("./events/appointment.events");
require("./events/payment.events");
require("./events/notification.events");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();