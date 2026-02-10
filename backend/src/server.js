require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 4000;

// SIMPLE MODE: No database connection - skip MongoDB
console.log("Running in SIMPLE MODE (no database)");

// Vercel serverless handler
const handler = async (req, res) => {
  return app(req, res);
};

// For local development
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`ERP backend listening on port ${port} (SIMPLE MODE)`);
  });
}

// Export for Vercel
module.exports = handler;
