import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.mjs";
import attendanceRoutes from "./routes/attendanceRoutes.mjs";
import globalErrorHandler from "./middlewares/globalErrorHandler.mjs";
import cookieParser from "cookie-parser";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/attendance", attendanceRoutes);

//Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`☑️  POS Server listening on port ${PORT}`));
