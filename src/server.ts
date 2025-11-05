import express from "express";
import "dotenv/config";
import { connectDB } from "config/db";
import routesTasks from "routes/tasksRouters";
import routesAccounts from "routes/account.Routers";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware cors
app.use(cors(
  {
    origin: ['http://localhost:5174', 'http://localhost:5173'],
  }
));

// Importing the routes
routesTasks(app);
routesAccounts(app);

// Connect to the database
connectDB().then(() => {
  // Starting the server after successful DB connected
  app.listen(PORT, () => {
    console.log(`Server is starting...: ${__dirname}`);
    const url = `http://localhost:${PORT}`;
    console.log(`Server is running on PORT: \x1b[32m\u001b]8;;${url}\u0007${url}\u001b]8;;\u0007\x1b[0m`);
  });
});
