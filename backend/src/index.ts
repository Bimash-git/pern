import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(cors({
	origin: ["http://localhost:5173", "http://localhost:5174"],
	methods: ["GET", "POST"],
	credentials: true
}))

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/uploads", express.static("uploads"), )

if (process.env.NODE_ENV !== "development") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});