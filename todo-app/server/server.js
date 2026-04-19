const express = require("express");
const cors = require("cors");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "client")));

app.use("/tasks", taskRoutes);
app.use("/categories", categoryRoutes);

app.get("/api", (req, res) => {
  res.send("API is running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));