require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.send("my server is running");
});

// Central error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "Email is already registered" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// Create the admin account on first start if it doesn't exist
const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  const exists = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (exists) return;
  await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });
  console.log(`Admin created: ${ADMIN_EMAIL}`);
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedAdmin)
  .then(() =>
    app.listen(PORT, () => console.log(`API running on port ${PORT}`)),
  )
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
