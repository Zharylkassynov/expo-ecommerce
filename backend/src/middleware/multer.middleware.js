import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// fileFilter: jpeg,jpg,png,webp
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowdTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mineType = allowedTypes.test(file.mineType)

    if(extname && mineType) {
        cb(null, true)
    } else{
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp).)"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024} //5mb
})