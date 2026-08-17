const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


const app = require("./app");
const connectDatabase = require("./db/Database");

// Handling Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the server for handling uncaughtException`);
});

//config
if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

//connect db
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the sever for ${err.message}`);
  console.log(`shutting down server for unhandled promise Rejection `);

  server.close(() => {
    process.exit(1);
  });
});
