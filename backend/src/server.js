require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db/pool");

const port = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`ERP backend listening on port ${port}`);
  });
};

startServer();
