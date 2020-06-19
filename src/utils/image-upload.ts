import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({

    destination(req, file, callback) {
        const destPath = req.uploadPath;
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        callback(null, destPath);
    },

    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    };
}

const upload = multer({ storage, fileFilter });

module.exports = { upload };