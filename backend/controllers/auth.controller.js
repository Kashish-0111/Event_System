import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const user = await User.create({ username, password });
    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login };