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

router.post("/register", async (req, res) => {
  const db = await connectDB();
  const { prenom, nom, age, ville, email, password } = req.body;

  if (!email || !password || !prenom || !nom || !age || !ville) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { prenom, nom, age, ville, email, password: hashedPassword };
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;