import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = () => {
  const PORT = config.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    connectDB();
  });
};

startServer();
