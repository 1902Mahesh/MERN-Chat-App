import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import connectToMongoDB from "./db/connectToMongidb.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 8000;


const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// app.get("/", (req, res) => {
//   res.send("hello world!!!");
// });

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server listening on port ${PORT}`);
});
