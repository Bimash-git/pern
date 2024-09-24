// import LZString from "lz-string";
// import prisma from "../db/prisma.js";
// import { uploadToCloudinary } from "../cloudinary/cloudinaryConfig.js";

// // Define types for the request body
// interface ImageMessageRequestBody {
//     conversationId: string;
//     senderId: string;
//     compressedImage: string;
// }

// export const handleImageMessage = async (req: Request, res: Response): Promise<void> => {
//     const { conversationId, senderId, compressedImage } = req.body as ImageMessageRequestBody;

//     // Decompress image
//     const decompressedImage = LZString.decompressFromBase64(compressedImage);

//     if (!decompressedImage) {
//         return res.status(400).json({ error: "Image decompression failed" });
//     }

//     try {
//         // Upload decompressed image to Cloudinary
//         const uploadedImage = await uploadToCloudinary(`data:image/jpeg;base64,${decompressedImage}`);

//         // Ensure uploadedImage has the correct structure
//         if (!uploadedImage || typeof uploadedImage !== 'object') {
//             return res.status(500).json({ error: "Invalid response from Cloudinary" });
//         }

//         // Save image URL in the database using Prisma
//         const newMessage = await prisma.message.create({
//             data: {
//                 conversationId,
//                 senderId,
//                 imageUrl: uploadedImage.secure_url,
//             },
//         });
//         console.log(newMessage);
//         res.json(newMessage);
//     } catch (error: any) {
//         res.status(500).json({ error: 'Error processing image message' });
//     }
// };