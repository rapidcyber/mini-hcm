import express from "express";
import connectDB from "./config/database.mjs";
import config from "./config/config.mjs";
import globalErrorHandler from "./middlewares/globalErrorHandler.mjs";
// import createHttpError from 'http-errors';
import userRouter from "./routes/userRoute.mjs";
import attendanceRouter from "./routes/attendanceRoute.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = config.port;
connectDB();

// Middleware to parse JSON
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://192.169.1.181:5173"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, from POS Server!");
});

// Other Endpoint
app.use("/api/user", userRouter);
app.use("/api/attendance", attendanceRouter);

//Global Error Handler
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`☑️  POS Server listening on port ${PORT}`);
});
