// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// import authRoutes from "./routes/authRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";
// import teacherRoutes from "./routes/teacherRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* ROUTES */
// app.use("/api/auth", authRoutes);
// app.use("/api/student", studentRoutes);
// app.use("/api/teacher", teacherRoutes);
// app.use("/api/admin", adminRoutes);
// export default app;


import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch((err) => console.log(err));
