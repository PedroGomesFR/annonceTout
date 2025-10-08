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
    const { prenom, nom, dateDeNaissance, ville, email, password } = req.body;

  if (!email || !password || !prenom || !nom || !dateDeNaissance || !ville) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { prenom, nom, dateDeNaissance, ville, email, password: hashedPassword };
    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully.", user: { id: result.insertedId, prenom, nom, dateDeNaissance, ville, email } });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  const db = await connectDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Optionally generate a JWT token here
    // const token = generateToken(user);

    res.status(200).json({ message: "Login successful.", user: { id: user._id, prenom: user.prenom, nom: user.nom, dateDeNaissance: user.dateDeNaissance, ville: user.ville, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;