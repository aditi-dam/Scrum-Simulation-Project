const bcrypt = require("bcrypt");
const { readStore, writeStore } = require("../services/dataStore");

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

exports.register = async (req, res) => {
  try {
    const username = cleanString(req.body.username).toLowerCase();
    const password = cleanString(req.body.password);
    const confirmPassword = cleanString(req.body.confirmPassword);

    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!/^[a-zA-Z0-9]{5,20}$/.test(username)) {
      return res.status(400).json({
        error: "Username must be 5-20 characters and alphanumeric."
      });
    }

    if (password.length < 8 || /\s/.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and contain no spaces."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const store = await readStore();
    const exists = store.users.find((u) => u.username === username);

    if (exists) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
      id: Date.now().toString(),
      username,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);
    await writeStore(store);

    req.session.user = {
      id: newUser.id,
      username: newUser.username
    };

    res.json({
      message: "Registered successfully.",
      user: req.session.user
    });
  } catch (e) {
    res.status(500).json({ error: "Unable to register user." });
  }
};

exports.login = async (req, res) => {
  try {
    const username = cleanString(req.body.username).toLowerCase();
    const password = cleanString(req.body.password);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const store = await readStore();
    const user = store.users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.json({
      message: "Logged in successfully.",
      user: req.session.user
    });
  } catch (e) {
    res.status(500).json({ error: "Unable to log in." });
  }
};

exports.me = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in." });
  }

  res.json({ user: req.session.user });
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully." });
  });
};

exports.guest = async (req, res) => {
  req.session.user = {
    id: `guest-${Date.now()}`,
    username: "guest"
  };

  res.json({
    message: "Guest session started.",
    user: req.session.user
  });
};