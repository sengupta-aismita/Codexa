import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./src/db/index.js";
import app from "./app.js";
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening at port : http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error : ", err);
    process.exit(1);
  });
