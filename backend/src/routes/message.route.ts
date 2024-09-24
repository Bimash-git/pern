import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getMessages, getUsersForSidebar, imageController, sendMessage } from "../controllers/message.controller.js";
import upload from "../cloudinary/multerConfig.js";
const router = express.Router();

router.get("/conversations", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/image",upload.single("image"), protectRoute, imageController)

export default router;
