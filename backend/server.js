import express from "express";
import cors from "cors";
import config from "./config/config.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import attendanceRoutes from "./routes/attendanceRoutes.mjs";
import globalErrorHandler from "./middlewares/globalErrorHandler.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: config.frontendUrl,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/attendance", attendanceRoutes);

//Global Error Handler
app.use(globalErrorHandler);


// Basic route
app.get('/', (req, res) => {

    res.send('Hello, from Mini-HCM Backend Server!');
});


const PORT = config.port || 5000;
// Start the server
app.listen(PORT, () => {
    console.log(`☑️  POS Server listening on port ${PORT}`);
});
