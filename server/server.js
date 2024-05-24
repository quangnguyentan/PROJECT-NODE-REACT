import express from "express";
const app = express();
require("dotenv").config();
import cors from "cors";
const PORT = process.env.PORT || 8080;
import initRoutes from "./src/routes";
import connectDB from "./src/config/connectDB";
require("./src/passport/index");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
initRoutes(app);
connectDB();
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
