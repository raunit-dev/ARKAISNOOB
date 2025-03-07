import { app } from "./app.js";
import dbConnect from "./dbconnect.js";

dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  })
  .catch(() => {
    console.log("Database connection failed");
    process.exit(1);
  });