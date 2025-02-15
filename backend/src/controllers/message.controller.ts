import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import LZString from "lz-string";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadToCloudinary } from "../cloudinary/cloudinaryConfig.js";
import fs from "fs";

export const sendMessage = async (req: Request, res: Response) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user.id;

		let conversation = await prisma.conversation.findFirst({
			where: {
				participantIds: {
					hasEvery: [senderId, receiverId],
				},
			},
		});

		// the very first message is being sent, that's why we need to create a new conversation
		if (!conversation) {
			conversation = await prisma.conversation.create({
				data: {
					participantIds: {
						set: [senderId, receiverId],
					},
				},
			});
		}

		const newMessage = await prisma.message.create({
			data: {
				senderId,
				body: message,
				conversationId: conversation.id,
			},
		});

		if (newMessage) {
			conversation = await prisma.conversation.update({
				where: {
					id: conversation.id,
				},
				data: {
					messages: {
						connect: {
							id: newMessage.id,
						},
					},
				},
			});
		}

		// Socket io will go here
		const receiverSocketId = getReceiverSocketId(receiverId);

		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error: any) {
		console.error("Error in sendMessage: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req: Request, res: Response) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user.id;

		const conversation = await prisma.conversation.findFirst({
			where: {
				participantIds: {
					hasEvery: [senderId, userToChatId],
				},
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!conversation) {
			return res.status(200).json([]);
		}

		res.status(200).json(conversation.messages);
	} catch (error: any) {
		console.error("Error in getMessages: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUsersForSidebar = async (req: Request, res: Response) => {
	try {
		const authUserId = req.user.id;

		const users = await prisma.user.findMany({
			where: {
				id: {
					not: authUserId,
				},
			},
			select: {
				id: true,
				fullname: true,
				profilePic: true,
			},
		});

		res.status(200).json(users);
	} catch (error: any) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


export const imageController = async (req: Request, res: Response) => {
	const { conversationId, senderId } = req.body;

	if (!req.file) {
		return res.status(400).json({ error: "No file is uploaded" });
	}

	const imagePath = req.file.path;

	if (!fs.existsSync(imagePath)) {
		return res.status(400).json({ error: "File does not exist" });
	}

	try {

		// Read the image as a base64 string
		const imageBuffer = fs.readFileSync(imagePath);
		const base64Image = imageBuffer.toString("base64");

		// Compress the image using LZString
		const compressedImage = LZString.compressToBase64(base64Image);

		// Upload the compressed image to Cloudinary
		const uploadedImageUrl = await uploadToCloudinary(`data:image/jpeg;base64,${compressedImage}`);

		if (!uploadedImageUrl || typeof uploadedImageUrl !== 'string') {
			return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
		}


		// Save image URL in the database using Prisma
		const newMessage = await prisma.message.create({
			data: {
				conversationId,
				senderId,
				body: "",
				imageUrl: uploadedImageUrl,
			},
		});

		// Optionally delete the file from disk after uploading to Cloudinary
		fs.unlinkSync(imagePath);

		res.json(newMessage);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error processing image message" });
	}
}