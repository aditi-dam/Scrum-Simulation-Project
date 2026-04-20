const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const { logger } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "TodoAuthState",
    secret: process.env.SESSION_SECRET || "super-secret-session-key",
    resave: false,
    saveUninitialized: false
  })
);

app.use(logger);

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.sendFile(path.join(__dirname, "client", "index.html"));
  }
  return res.redirect("/auth/login");
});

app.use(express.static(path.join(__dirname, "client")));

app.use("/tasks", taskRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

app.get("/api", (req, res) => {
  res.send("API is running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));