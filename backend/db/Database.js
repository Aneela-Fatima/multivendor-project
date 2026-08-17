const mongoose = require("mongoose");
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database connected smoothly!"))
    .catch((err) => console.error("Database connection error:", err));
};

module.exports = connectDatabase;
