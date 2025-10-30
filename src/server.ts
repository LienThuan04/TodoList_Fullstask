import express from "express";
import "dotenv/config";
import routes from "routes/tasksRouters";
import { connectDB } from "config/DB";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Importing the routes
routes(app);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is starting...: ${__dirname}`);
  const url = `http://localhost:${PORT}`;
console.log(`Server is running on PORT: \x1b[32m\u001b]8;;${url}\u0007${url}\u001b]8;;\u0007\x1b[0m`);
});
