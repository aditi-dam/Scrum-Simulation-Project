const express = require("express");
const cors = require("cors");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "client")));

app.use("/tasks", taskRoutes);

// Optional root message
app.get("/api", (req, res) => {
  res.send("API is running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));