import cloudinary from "cloudinary";

// configuring cloudinary with my credentials
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Store this in your environment variables
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (base64Image: string) => {
    try {
        const result = await cloudinary.v2.uploader.upload(base64Image, {
            folder: "chat_images",
            upload_preset: "pern_chatonomy"
        });
        return result
    } catch (error) {
        throw new Error("Cloudinary upload failed");
    }
}