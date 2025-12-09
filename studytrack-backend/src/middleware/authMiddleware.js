const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return res.json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      res.status(401);
      return res.json({ message: "Not authorized, user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    res.json({ message: "Not authorized, token failed" });
  }
};

module.exports = auth;
