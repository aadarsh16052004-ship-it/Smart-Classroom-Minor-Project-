import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ── LOGIN ─────────────────────────────────────────────── */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ── REGISTER ──────────────────────────────────────────── */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only student and teacher can self-register
    if (!["student", "teacher"].includes(role))
      return res.status(400).json({ message: "Invalid role. Only student or teacher can register." });

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, role });

    // Create profile document
    if (role === "student") {
      // Auto-generate roll number
      const count = await Student.countDocuments();
      await Student.create({
        userId:     user._id,
        rollNumber: `STU${String(count + 1).padStart(3, "0")}`,
        subjects:   [],
        detainedSubjects: [],
      });
    } else if (role === "teacher") {
      await Teacher.create({ userId: user._id, subjects: [] });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};
