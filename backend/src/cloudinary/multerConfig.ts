import multer from "multer";
import path from "path";

// Set up storage configuration for multer with disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
  }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/; // Allow specific image formats
      const mimetype = fileTypes.test(file.mimetype);
  
      if (mimetype) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed."));
      }
    },
  });
  
  export default upload;