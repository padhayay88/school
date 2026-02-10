const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message, err.stack);
  res.status(500).json({ 
    message: "Server error", 
    error: process.env.NODE_ENV === "production" ? undefined : err.message 
  });
};

module.exports = { errorHandler };
