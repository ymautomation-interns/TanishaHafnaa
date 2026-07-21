import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword =
    process.env.ADMIN_PASSWORD_HASH &&
    bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH);

  if (!validUsername || !validPassword) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token });
});
