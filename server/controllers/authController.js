import jwt from "jsonwebtoken";

// POST /api/auth/login
export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Check against env variables
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // valid for 1 day
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};
