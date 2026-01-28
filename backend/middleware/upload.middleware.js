import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: "./uploads/", // Files will be stored here
    filename: (req, file, cb) => {
        // Renames file to: timestamp-originalname.pdf
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File validation logic
const fileFilter = (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error("Error: Only PDFs are allowed!"));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

export default upload;