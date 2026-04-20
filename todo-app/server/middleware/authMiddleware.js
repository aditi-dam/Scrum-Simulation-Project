function logger(req, res, next) {
  const time = new Date().toUTCString();
  const auth = req.session.user
    ? `(Authenticated ${req.session.user.username})`
    : "(Non-Authenticated)";
  console.log(`[${time}]: ${req.method} ${req.path} ${auth}`);
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  next();
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

module.exports = { logger, requireAuth, redirectIfAuthenticated };