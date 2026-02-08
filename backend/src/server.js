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

// Vercel serverless handler
const handler = async (req, res) => {
  await ensureConnection();
  return app(req, res);
};

// For local development
if (!process.env.VERCEL) {
  const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
      console.log(`ERP backend listening on port ${port}`);
    });
  };
  startServer();
}

// Export for Vercel
module.exports = handler;
