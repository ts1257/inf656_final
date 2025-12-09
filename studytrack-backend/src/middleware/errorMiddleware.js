const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message || "Server error"
  });
};

module.exports = { notFound, errorHandler };
