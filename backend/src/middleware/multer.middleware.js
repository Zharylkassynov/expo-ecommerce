import multer from 'multer';
import path from 'path';

// Use memory storage instead of disk storage to avoid creating tmp directory
const storage = multer.memoryStorage();

// fileFilter: jpeg,jpg,png,webp
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)."));
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024} //5mb
})