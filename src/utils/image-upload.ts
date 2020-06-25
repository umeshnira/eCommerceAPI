import multer from 'multer';
import fs from 'fs';
import { application } from '../config/app-settings.json';
import path from 'path';

const storage = multer.diskStorage({

    destination(req, file, callback) {
        const destPath =  path.resolve(__dirname, application.imageStoragePath);;
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

const file_upload = multer({ storage, fileFilter });

export default file_upload;