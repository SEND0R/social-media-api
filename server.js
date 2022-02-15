import express from "express";
const port = process.env.PORT || 9000;

import connectdb from "./config/mongoconfig.js";
// import routes
import userRouter from "./routes/api/users.js";
import profileRouter from "./routes/api/profile.js";
import authRouter from "./routes/api/auth.js";

const app = express();
connectdb();

// using middleware from here
app.use(express.json());

// ****************************routes ****************
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

// ********** listen ************************************

app.listen(port, () => {
  console.log("server is started");
});
