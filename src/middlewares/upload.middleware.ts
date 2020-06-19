export function setUploadPath(uploadPath: any) {
    return (req: { uploadPath: any; }, res: any, next: () => void) => {
        req.uploadPath = uploadPath;
        next();
    }
}