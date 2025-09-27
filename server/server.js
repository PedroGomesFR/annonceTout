import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/records.js";
dotenv.config({ path: ".env" });

const port = process.env.PORT || 5050;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5050",
      "https://exquisite-custard-0524a7.netlify.app",
      "http://localhost:3000",

    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});