require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db/pool");

const port = process.env.PORT || 4000;

// Connect to DB on cold start
let isConnected = false;
const ensureConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = async (req, res) => {
    await ensureConnection();
    return app(req, res);
  };
} else {
  // For local development
  const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
      console.log(`ERP backend listening on port ${port}`);
    });
  };
  startServer();
}
