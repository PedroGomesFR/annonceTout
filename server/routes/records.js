import connectDB from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
// import { generateToken, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  res.json({ message: "API is working!" });
});

export default router;